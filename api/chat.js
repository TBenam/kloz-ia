export default async function handler(req, res) {
  // 1. Vérification Clé
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Clé API introuvable dans Vercel." });
  }

  const { message, history, context } = req.body;

  try {
    // 2. Reconstruction de l'historique
    let contents = (history || []).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.parts[0].text }]
    }));

    // 3. Ajout du message actuel à la fin
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    // 4. L'ASTUCE DU PROF (Version Blindée) 🛡️
    // Au lieu de créer un champ "systemInstruction" qui plante,
    // on INJECTE le contexte directement à l'intérieur du TOUT PREMIER message.
    // L'IA lira ça en premier et obéira.
    if (context && contents.length > 0) {
      const originalFirstMessage = contents[0].parts[0].text;
      contents[0].parts[0].text = `[INSTRUCTIONS SYSTÈME - CONTEXTE BUSINESS]\n${context}\n\n[DÉBUT DE LA CONVERSATION]\n${originalFirstMessage}`;
    }

    // 5. Envoi direct à l'API v1 (sans l'option interdite)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: contents,
          // ⚠️ ON A SUPPRIMÉ LE CHAMP "systemInstruction" QUI PLANTAIT ⚠️
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      // On capture l'erreur précise si Google n'est toujours pas content
      throw new Error(data.error?.message || "Erreur API Google inconnue");
    }

    // Extraction de la réponse
    const text = data.candidates[0].content.parts[0].text;

    return res.status(200).json({ text: text });

  } catch (error) {
    console.error("ERREUR:", error);
    return res.status(500).json({ 
      error: `Erreur technique : ${error.message}` 
    });
  }
}