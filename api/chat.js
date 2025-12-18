import { GoogleGenerativeAI } from "@google/generative-ai";

// Attention : Assure-toi d'utiliser la bonne classe d'import selon ta version. 
// Pour la version standard : "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  // Headers CORS pour autoriser le frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // 1. On récupère TOUT ce que le frontend envoie
    const { message, history, context } = req.body;

    // 2. On configure le modèle avec tes instructions (le System Prompt)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash", // Utilise 1.5-flash qui est plus stable/rapide
      systemInstruction: context // C'est ICI que ton prompt "Vendeur de sneakers" s'applique
    });

    // 3. On démarre le chat avec l'historique
    const chat = model.startChat({
      history: history || [], // On injecte l'historique de la conversation
    });

    // 4. On envoie le nouveau message
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text(); // La bonne façon de récupérer le texte

    // 5. IMPORTANT : On renvoie la clé "text" pour matcher avec App.jsx
    res.status(200).json({ text: text });

  } catch (error) {
    console.error("Erreur Backend:", error);
    res.status(500).json({ 
      text: `Erreur : ${error.message}` // On renvoie aussi "text" ici pour l'afficher dans la bulle rouge
    });
  }
}