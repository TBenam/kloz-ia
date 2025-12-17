export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const { message, history, businessName, context } = req.body;

    const systemPrompt = `
Tu es un expert en vente agissant comme assistant WhatsApp pour "${businessName}".

CONTEXTE BUSINESS :${context}

Règles :
- Réponses courtes
- Ton naturel WhatsApp
- Objectif : réserver un appel
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            ...history,
            { role: 'user', parts: [{ text: message }] }
          ],
          systemInstruction: { parts: [{ text: systemPrompt }] },
          generationConfig: { temperature: 0.7, maxOutputTokens: 150 }
        })
      }
    );

    const data = await response.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Je te mets en relation avec un humain pour t'aider.";

    res.status(200).json({ text });
  } catch (e) {
    res.status(500).json({ error: 'Erreur IA' });
  }
}