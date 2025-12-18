import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req, res) {
  // Headers obligatoires
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { message } = req.body;

    // CORRECTION : On utilise le modèle 2.0 Experimental (le vrai modèle "futuriste")
    // Le "2.5" de ton guide est soit une erreur, soit pas encore activé sur ton compte.
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp", 
      contents: message,
    });

    // Avec le SDK 2025, on récupère le texte comme ça
    let text = response.text;

    // Filet de sécurité : Si c'est vide, on le dit clairement
    if (!text) {
      text = "Le modèle a répondu mais le texte est vide (Sécurité ou format inattendu).";
    }

    res.status(200).json({ reply: text });

  } catch (error) {
    console.error("Erreur Gemini:", error);
    // Affichage de l'erreur réelle dans la bulle pour debug
    res.status(200).json({ 
      reply: `ERREUR : ${error.message}` 
    });
  }
}