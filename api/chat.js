import { GoogleGenAI } from "@google/genai";

// On utilise le SDK que tu as déjà installé
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req, res) {
  // --- HEADERS CORS (Indispensable pour que le frontend puisse parler au backend) ---
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { message, history, context } = req.body;

    // 1. Préparation de l'historique pour ce SDK spécifique
    // On s'assure que l'historique est propre
    let contents = [];
    if (history && Array.isArray(history)) {
      contents = history.map(msg => ({
        role: msg.role,
        parts: msg.parts
      }));
    }

    // 2. On ajoute le message actuel de l'utilisateur
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    // 3. Appel API avec le format "@google/genai"
    const result = await ai.models.generateContent({
      model: "gemini-1.5-flash", 
      config: {
        // C'est ici qu'on injecte ton contexte de vendeur
        systemInstruction: { parts: [{ text: context || "Tu es un assistant utile." }] }
      },
      contents: contents
    });

    // 4. Extraction de la réponse (Méthode sécurisée)
    // Ce SDK renvoie parfois la réponse imbriquée différemment
    const responseText = result.response.candidates[0].content.parts[0].text;

    // 5. On renvoie la clé "text" que le Frontend attend
    res.status(200).json({ text: responseText });

  } catch (error) {
    console.error("ERREUR BACKEND :", error);
    // En cas d'erreur, on renvoie le message d'erreur dans la bulle
    res.status(200).json({ 
      text: `Désolé, une erreur technique est survenue : ${error.message}` 
    });
  }
}