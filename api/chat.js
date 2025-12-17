export default async function handler(req, res) {
  // 1. Vérification de sécurité
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Clé API introuvable dans Vercel." });
  }

  // 2. Récupération des données du site
  const { message, history, context } = req.body;

  try {
    // 3. Préparation des messages pour l'API Google (Format strict)
    // On prend l'historique et on ajoute le message actuel à la fin
    const contents = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.parts[0].text }]
    }));
    
    // On ajoute la question actuelle
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    // 4. APPEL DIRECT À L'API (La méthode du Prof : v1 et pas v1beta !)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: contents,
          // Ici on met tes instructions de vente (le "System Prompt")
          systemInstruction: {
            parts: [{ text: context || "Tu es un assistant utile." }]
          },
          generationConfig: {
            temperature: 0.7, // Créativité équilibrée
            maxOutputTokens: 500
          }
        })
      }
    );

    // 5. Gestion de la réponse
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Erreur API Google");
    }

    // On extrait le texte de la réponse complexe de Google
    const text = data.candidates[0].content.parts[0].text;

    return res.status(200).json({ text: text });

  } catch (error) {
    console.error("ERREUR:", error);
    return res.status(500).json({ 
      error: `Erreur technique : ${error.message}` 
    });
  }
}