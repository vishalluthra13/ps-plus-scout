
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { DailyRecommendations } from "../types";

// Create the AI instance. process.env.API_KEY is automatically injected by the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_PROMPT = `You are a PlayStation gaming expert specializing in the Indian market. Your task is to suggest 9 games (3 per category) currently available for PS Plus Extra/Deluxe subscribers in India.

User Context:
- Owns a PS5 in India.
- Played & Liked: Miles Morales, Spider-Man 2, RDR2, God of War, Ghost of Tsushima, TLOU 1/2, Uncharted, FIFA/FC, Mortal Kombat 1.
- Has PS Plus Extra/Deluxe.

Categories:
1. Single Player (Cinematic, narrative action)
2. Multiplayer Online (Competitive/Co-op)
3. Split-screen/Couch (Local play)

STRICT RULES:
- Use Google Search to verify the game is CURRENTLY in the PS Plus Extra/Deluxe catalog for India.
- Focus on high-quality titles (Metacritic 75+).
- The output MUST be a valid JSON object only. No markdown formatting, no extra text.
- Tailor 'whyPlay' to the user's history (e.g., "Since you loved Ghost of Tsushima, you'll enjoy the combat here...").`;

export const getDailyRecommendations = async (): Promise<DailyRecommendations> => {
  // Use Pro model for complex reasoning + search + JSON compliance
  const model = 'gemini-3-pro-preview';
  
  try {
    const response = await ai.models.generateContent({
      model,
      contents: "Scout 9 games for PS Plus Extra in India. 3 Single Player, 3 Multiplayer, 3 Couch Co-op. Focus on titles similar to Sony first-party hits and sports/fighters. Ensure they are available in the India store today.",
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            games: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  category: { type: Type.STRING, enum: ['Single Player', 'Multiplayer Online', 'Split-screen/Couch'] },
                  rating: { type: Type.NUMBER },
                  whyPlay: { type: Type.STRING },
                  playtime: { type: Type.STRING },
                  genre: { type: Type.STRING },
                  platform: { type: Type.ARRAY, items: { type: Type.STRING } },
                  imageUrl: { type: Type.STRING }
                },
                required: ['id', 'title', 'category', 'rating', 'whyPlay', 'genre', 'platform', 'imageUrl']
              }
            }
          },
          required: ['games']
        },
        systemInstruction: SYSTEM_PROMPT
      }
    });

    if (!response.text) {
      throw new Error("Empty response from AI");
    }

    // Robust JSON cleaning: strip markdown code blocks if present
    let cleanJson = response.text.trim();
    if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }
    
    const parsed = JSON.parse(cleanJson);
    
    // Safely extract sources
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks.map((chunk: any) => ({
      title: chunk.web?.title || "PlayStation Store India",
      web: { uri: chunk.web?.uri || "https://www.playstation.com/en-in/ps-plus/games/" }
    }));

    return {
      date: new Date().toLocaleDateString('en-IN'),
      games: parsed.games,
      sources: sources.length > 0 ? sources : [{ title: "PS Plus Catalog", web: { uri: "https://www.playstation.com/en-in/ps-plus/games/" } }]
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
