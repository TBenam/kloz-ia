import { GoogleGenAI } from "@google/genai";

// Récupère ta clé secrète (assure-toi qu'elle est bien dans ton fichier .env)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req, res) {
  // Cette ligne permet de gérer les problèmes de sécurité (CORS)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { message, history } = req.body; // On récupère le message envoyé par le site

    // Configuration du modèle (Flash 2.0 est plus récent et rapide)
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Envoi du message à Gemini
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    // On renvoie la réponse au site web
    res.status(200).json({ reply: text });

  } catch (error) {
    console.error("Erreur Gemini:", error);
    res.status(500).json({ error: "Erreur lors de la génération de la réponse" });
  }
}