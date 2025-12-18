import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req, res) {
  // --- HEADERS CORS ---
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { message, history, context } = req.body;

    // 1. Préparation de l'historique
    let contents = [];
    if (history && Array.isArray(history)) {
      contents = history.map(msg => ({
        role: msg.role,
        parts: msg.parts
      }));
    }

    // 2. Ajout du message actuel
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    // 3. Appel API (Gemini 2.5 Flash est bien dispo en déc. 2025)
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      config: {
        systemInstruction: { parts: [{ text: context || "Tu es un assistant utile." }] }
      },
      contents: contents
    });

    // --- CORRECTION MAJEURE ICI ---
    // Avec @google/genai, "result" contient DIRECTEMENT "candidates" ou "text"
    // On vérifie d'abord si on a du texte directement accessible
    let responseText = "";
    
    if (result.text) {
        // Le SDK récent offre souvent cet accesseur direct
        responseText = result.text;
    } else if (result.candidates && result.candidates.length > 0) {
        // Sinon on va chercher à la main dans la structure
        responseText = result.candidates[0].content.parts[0].text;
    } else {
        responseText = "Aucune réponse générée.";
    }

    // 5. Envoi au frontend
    res.status(200).json({ text: responseText });

  } catch (error) {
    console.error("ERREUR:", error);
    res.status(200).json({ 
      text: `Erreur technique : ${error.message}` 
    });
  }
}