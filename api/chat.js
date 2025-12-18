import { GoogleGenAI } from "@google/genai";

// On suit ton guide : Initialisation du client 2025
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req, res) {
  // Headers obligatoires pour que le site fonctionne
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { message } = req.body;

    // APPLICATION STRICTE DU GUIDE
    // Utilisation du modèle 2.5-flash qui correspond au SDK v1beta
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: message,
    });

    // Dans le nouveau SDK, .text est une propriété (pas une fonction)
    const text = response.text;

    res.status(200).json({ reply: text });

  } catch (error) {
    console.error("Erreur Gemini:", error);
    // On affiche l'erreur complète pour comprendre si le modèle 2.5 coince
    res.status(500).json({ 
      error: error.message,
      details: "Le guide demande gemini-2.5-flash via @google/genai" 
    });
  }
}