import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { message } = req.body;

    // On utilise la version STABLE 1.5 Flash
    // (L'erreur "version v1" d'avant n'arrivera plus avec ce nouveau code)
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash", 
      contents: message, 
    });

    const text = response.text; 

    res.status(200).json({ reply: text });

  } catch (error) {
    console.error("Erreur Backend:", error);
    // Au lieu de planter, on envoie un message d'erreur visible dans la bulle
    res.status(200).json({ reply: "Désolé, je rencontre un problème technique pour le moment. (Vérifie tes logs Vercel)" });
  }
}