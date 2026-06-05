import Anthropic from "@anthropic-ai/sdk";
import { DailyRecommendations } from "../types";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true,
});

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
- Use the web_search tool to verify games are CURRENTLY in the PS Plus Extra/Deluxe catalog for India.
- Focus on high-quality titles (Metacritic 75+).
- Tailor 'whyPlay' to the user's history (e.g., "Since you loved Ghost of Tsushima, you'll enjoy the combat here...").
- Your FINAL response must be a valid JSON object only — no markdown, no extra text.
- JSON structure: { "games": [ { "id": string, "title": string, "category": "Single Player"|"Multiplayer Online"|"Split-screen/Couch", "rating": number, "whyPlay": string, "playtime": string, "genre": string, "platform": string[], "imageUrl": string } ] }`;

export const getDailyRecommendations = async (): Promise<DailyRecommendations> => {
  const response = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    tools: [{ type: "web_search_20260209", name: "web_search" }],
    messages: [{
      role: "user",
      content: "Scout 9 games for PS Plus Extra in India. 3 Single Player, 3 Multiplayer Online, 3 Split-screen/Couch. Focus on titles similar to Sony first-party hits and sports/fighters. Use web search to confirm they are available in the India PS Plus catalog today, then return your final JSON.",
    }],
  });

  const textBlock = response.content.find(b => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from Claude");
  }

  let cleanJson = textBlock.text.trim();
  if (cleanJson.startsWith("```")) {
    cleanJson = cleanJson.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }

  const parsed = JSON.parse(cleanJson);

  return {
    date: new Date().toLocaleDateString("en-IN"),
    games: parsed.games,
    sources: [{ title: "PS Plus Catalog India", web: { uri: "https://www.playstation.com/en-in/ps-plus/games/" } }],
  };
};
