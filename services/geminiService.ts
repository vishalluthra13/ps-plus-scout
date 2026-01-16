
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { DailyRecommendations } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_PROMPT = `You are a PlayStation gaming expert. Your task is to suggest 9 games (3 for each category) available for FREE under the PS Plus Extra or Monthly Essential subscription specifically for the India region.

User Context:
- Owns a PS5 in India.
- Played: Miles Morales, Spider-Man 2, RDR2, God of War, Ghost of Tsushima, TLOU 1/2, Uncharted Series, FC (FIFA), Mortal Kombat 1.
- Has PS Plus Extra.

Categories:
1. Single Player (Narrative-driven, action, or exploration)
2. Multiplayer Online (Competitive or cooperative online play)
3. Split-screen/Couch (Local co-op or versus games)

Requirements:
- Only suggest games currently available in PS Plus Extra catalog or this month's Essential free games.
- Games must be highly rated (Metacritic 80+ preferred).
- Provide a compelling "Why Play" reason tailored to someone who likes cinematic action games (Sony exclusives) and sports/fighting games.
- Use Google Search grounding to verify the current PS Plus Extra catalog for India for today.

Output must be in JSON format matching the schema provided.`;

export const getDailyRecommendations = async (): Promise<DailyRecommendations> => {
  const model = 'gemini-3-flash-preview';
  
  const response = await ai.models.generateContent({
    model,
    contents: "Find 9 fresh game recommendations for PS Plus Extra subscribers in India for today. Ensure 3 are Single Player, 3 are Multiplayer Online, and 3 are Couch Co-op. The games should be currently in the catalog.",
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

  const jsonStr = response.text.trim();
  const parsed = JSON.parse(jsonStr);
  
  // Extract sources from grounding metadata if available
  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

  return {
    date: new Date().toLocaleDateString('en-IN'),
    games: parsed.games,
    sources: sources.map((s: any) => ({
      title: s.web?.title || 'PS Plus Official Site',
      web: { uri: s.web?.uri || 'https://www.playstation.com/en-in/ps-plus/games/' }
    }))
  };
};
