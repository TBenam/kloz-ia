import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  // Vérification de la clé
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: "Clé API introuvable" });
  }

  const { message, history, context } = req.body;

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // ✅ LA CORRECTION DU PROF : On utilise le modèle valide 1.5 Flash
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Nettoyage de l'historique (pour éviter le bug "role user")
    const chatHistory = (history || []).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: msg.parts
    }));

    const chat = model.startChat({
      history: chatHistory,
    });

    // Injection du contexte
    let finalPrompt = message;
    if (context) {
      finalPrompt = `[INSTRUCTIONS SYSTÈME]\n${context}\n\n[MESSAGE UTILISATEUR]\n${message}`;
    }

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