import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req, res) {
  // Headers habituels
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { message } = req.body;

    // On garde le modèle de ton guide
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: message,
    });

    // --- LE DEBUG ---
    // On regarde ce qu'il y a VRAIMENT dans la réponse
    let text = response.text;

    // Si le texte est vide ou inexistant, on affiche TOUT ce qu'on a reçu (en JSON)
    // C'est ça qui va remplir ta bulle vide
    if (!text) {
      console.log("Texte vide. Affichage brut.");
      text = "DEBUG (Réponse brute) : " + JSON.stringify(response, null, 2);
    }

    res.status(200).json({ reply: text });

  } catch (error) {
    console.error("Erreur Catch:", error);
    // Si ça plante ici, on affiche l'erreur exacte
    res.status(200).json({ 
      reply: `ERREUR CRITIQUE (Catch) : ${error.message}` 
    });
  }
}