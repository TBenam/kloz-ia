import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  // 1. Vérifier que la clé est là
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: "Clé API manquante dans Vercel" });
  }

  // 2. Récupérer les données envoyées par ton site
  const { message, history, context } = req.body;

  try {
    // 3. Connecter Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // 4. Préparer la discussion avec TES instructions
    // On transforme l'historique pour qu'il soit compréhensible par Gemini
    const chatHistory = (history || []).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: msg.parts
    }));

    // On démarre le chat
    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    // 5. La technique secrète : On injecte le contexte DANS le message si c'est le début
    // Ou on l'ajoute comme instruction système "cachée"
    let finalPrompt = message;
    
    // Si c'est un contexte de vente, on le rappelle pour être sûr qu'il obéisse
    if (context) {
      finalPrompt = `CONTEXTE IMPORTANT (Tu dois l'incarner) : ${context}\n\nMESSAGE DU CLIENT : ${message}`;
    }

    // 6. Envoi
    const result = await chat.sendMessage(finalPrompt);
    const response = await result.response;
    const text = response.text();

    // 7. Réponse au site
    return res.status(200).json({ text: text });

  } catch (error) {
    console.error("Erreur Gemini:", error);
    return res.status(500).json({ error: "Le cerveau de l'IA a surchauffé." });
  }
}