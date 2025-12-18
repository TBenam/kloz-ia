import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req, res) {
  // --- Headers pour autoriser ton site à parler au serveur ---
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { message } = req.body;

    // 1. On appelle le modèle 1.5 Flash (le plus fiable)
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: message,
    });

    // 2. On essaie de récupérer le texte de plusieurs façons (Filet de sécurité)
    let text = response.text; // Méthode directe (nouveau SDK)

    // Si la méthode directe est vide, on cherche dans les candidats (ancienne méthode)
    if (!text && response.candidates && response.candidates.length > 0) {
      const parts = response.candidates[0].content.parts;
      if (parts && parts.length > 0) {
        text = parts[0].text;
      }
    }

    // 3. Si toujours rien, c'est peut-être une sécurité ou un bug
    if (!text) {
      console.log("Réponse vide reçue de Gemini :", JSON.stringify(response, null, 2));
      text = "Désolé, je n'ai pas pu générer de réponse (Réponse vide ou bloquée).";
    }

    // 4. On renvoie le texte trouvé
    res.status(200).json({ reply: text });

  } catch (error) {
    console.error("ERREUR CRITIQUE:", error);
    // On renvoie l'erreur précise pour que tu puisses la lire dans la bulle
    res.status(500).json({ 
      error: error.message || "Erreur inconnue",
      reply: "Erreur technique : " + (error.message || "Voir logs")
    });
  }
}