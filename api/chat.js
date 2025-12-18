import { GoogleGenAI } from "@google/genai";

// Initialisation (récupère ta clé dans les variables d'environnement)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req, res) {
  // --- Gestion des permissions (CORS) ---
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { message } = req.body;

    // --- CORRECTION : Utilisation de Gemini 2.5 Flash ---
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: message, 
    });

    // Récupération de la réponse
    const text = response.text; 

    res.status(200).json({ reply: text });

  } catch (error) {
    console.error("Erreur Gemini:", error);
    // On affiche l'erreur exacte dans la console de Vercel pour t'aider si ça replante
    res.status(500).json({ error: "Erreur lors de la génération de la réponse" });
  }
}