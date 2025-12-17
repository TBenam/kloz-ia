export default async function handler(req, res) {
  // 1. Nettoyage de la clé (Sécurité)
  const apiKey = (process.env.GEMINI_API_KEY || "").trim();

  if (!apiKey) {
    return res.status(500).json({ error: "Clé API introuvable." });
  }

  const { message, history, context } = req.body;

  try {
    // 2. Préparation des messages (Format Standard Google)
    let contents = (history || []).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.parts[0].text }]
    }));

    // Ajout de la question actuelle
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    // 3. L'ASTUCE DU "CHAVAL DE TROIE" 🐴
    // Au lieu d'utiliser un champ "systemInstruction" compliqué,
    // on cache les instructions directement dans le tout premier message.
    // L'IA le lira forcément et obéira.
    if (context && contents.length > 0) {
      const originalFirstMessage = contents[0].parts[0].text;
      contents[0].parts[0].text = `[RÔLE ET CONTEXTE]\n${context}\n\n[DÉBUT DE LA DISCUSSION]\n${originalFirstMessage}`;
    }

    // 4. APPEL SUR LA ROUTE STABLE (v1)
    // On utilise "gemini-1.5-flash" tout court. C'est le standard.
    // Et on tape sur "v1" (pas beta) car on sait qu'elle répond.
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: contents,
          // Pas de champs exotiques ici, juste du simple et efficace
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || `Erreur ${response.status}`);
    }

    const text = data.candidates[0].content.parts[0].text;
    return res.status(200).json({ text: text });

  } catch (error) {
    console.error("ERREUR:", error);
    return res.status(500).json({ 
      error: `Erreur : ${error.message}` 
    });
  }
}