import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req, res) {
  // --- Headers (Obligatoires) ---
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { message } = req.body;

    // TENTATIVE 1 : Le modèle Gemini 2.0 Flash (Sorti récemment)
    // Si ton guide disait 2.5, c'est probablement celui-ci qu'il faut utiliser.
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp", 
      contents: message,
    });

    const text = response.text;
    res.status(200).json({ reply: text });

  } catch (error) {
    console.error("Erreur Gemini:", error);
    
    // --- MODE DEBUG ---
    // Si ça plante, l'IA te dira exactement pourquoi dans la bulle de chat
    res.status(200).json({ 
      reply: `ERREUR TECHNIQUE : Le modèle n'a pas répondu. \nMessage d'erreur de Google : ${error.message}` 
    });
  }
}