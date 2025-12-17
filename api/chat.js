import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  // Vérification de la clé
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: "Clé API introuvable" });
  }

  const { message, history, context } = req.body;

  try {
    // Connexion à Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // RETOUR AU MODÈLE "PRO" (Le plus stable et compatible)
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Préparation de l'historique
    const chatHistory = (history || []).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: msg.parts
    }));

    const chat = model.startChat({
      history: chatHistory,
    });

    // INJECTION DU CONTEXTE
    let finalPrompt = message;
    if (context) {
      finalPrompt = `[INSTRUCTION IMPORTANTE DU SYSTÈME]\nTu es un assistant virtuel. Voici tes instructions :\n${context}\n\n[MESSAGE UTILISATEUR]\n${message}`;
    }

    // Envoi
    const result = await chat.sendMessage(finalPrompt);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ text: text });

  } catch (error) {
    console.error("ERREUR GEMINI:", error);
    return res.status(500).json({ 
      error: `Erreur technique : ${error.message || error.toString()}` 
    });
  }
}