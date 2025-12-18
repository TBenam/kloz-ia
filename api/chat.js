import { GoogleGenAI } from "@google/genai";

// On utilise bien la librairie installée dans ton package.json
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

    // 2. Ajout du message utilisateur actuel
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    // 3. Appel API avec GEMINI 2.5
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash", // ✅ Version corrigée pour 2025
      config: {
        // Le contexte (Vendeur de sneakers) est injecté ici
        systemInstruction: { parts: [{ text: context || "Tu es un assistant utile." }] }
      },
      contents: contents
    });

    // 4. Extraction sécurisée de la réponse
    // Avec le SDK @google/genai récent, la structure est parfois imbriquée
    const responseText = result.response.candidates[0].content.parts[0].text;

    // 5. Envoi au frontend avec la clé "text" (Correction de la bulle vide)
    res.status(200).json({ text: responseText });

  } catch (error) {
    console.error("ERREUR CRITIQUE:", error);
    res.status(200).json({ 
      text: `Erreur technique (${error.message}). Vérifie ta clé API ou tes quotas.` 
    });
  }
}