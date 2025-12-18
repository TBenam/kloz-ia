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

    // On utilise le modèle 2.5 comme tu le souhaites
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: message,
    });

    // --- DIAGNOSTIC ---
    // On vérifie si le texte existe. 
    // S'il n'existe pas, on convertit TOUTE la réponse en texte pour la lire.
    let text = response.text;

    if (!text) {
      console.log("Réponse vide, affichage du brut...");
      // On force l'affichage du contenu technique pour comprendre pourquoi c'est vide
      // (Cela affichera le JSON brut dans ta bulle de chat)
      text = "DEBUG (Réponse vide) : " + JSON.stringify(response, null, 2);
    }

    res.status(200).json({ reply: text });

  } catch (error) {
    console.error("Erreur:", error);
    // Si ça plante, on affiche l'erreur dans la bulle
    res.status(200).json({ 
      reply: `ERREUR CRITIQUE : ${error.message}` 
    });
  }
}