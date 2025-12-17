export default async function handler(req, res) {
  // 1. Nettoyage de la clé (Anti-espace vide)
  // On enlève les espaces avant/après qui causent souvent l'erreur 404
  const apiKey = (process.env.GEMINI_API_KEY || "").trim();

  if (!apiKey) {
    return res.status(500).json({ error: "Clé API introuvable ou vide." });
  }

  const { message, history, context } = req.body;

  try {
    // 2. Préparation (Fusion contexte + message)
    let contents = (history || []).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.parts[0].text }]
    }));

    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    if (context && contents.length > 0) {
      const originalFirstMessage = contents[0].parts[0].text;
      contents[0].parts[0].text = `[CONTEXTE BUSINESS]\n${context}\n\n[MESSAGE CLIENT]\n${originalFirstMessage}`;
    }

    // 3. APPEL BLINDÉ (Nom complet + v1beta + clé nettoyée)
    // On utilise "gemini-1.5-flash-latest" pour forcer la version active
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      // On affiche l'erreur brute pour le diagnostic
      throw new Error(data.error?.message || `Erreur ${response.status}: ${response.statusText}`);
    }

    const text = data.candidates[0].content.parts[0].text;
    return res.status(200).json({ text: text });

  } catch (error) {
    console.error("ERREUR:", error);
    return res.status(500).json({ 
      error: `Erreur Google : ${error.message}` 
    });
  }
}