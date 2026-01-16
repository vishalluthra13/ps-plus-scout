
export interface Game {
  id: string;
  title: string;
  category: 'Single Player' | 'Multiplayer Online' | 'Split-screen/Couch';
  rating: number;
  whyPlay: string;
  playtime: string;
  genre: string;
  platform: string[];
  imageUrl: string;
}

export interface DailyRecommendations {
  date: string;
  games: Game[];
  sources: { title: string; web: { uri: string } }[];
}

export enum GameCategory {
  SINGLE_PLAYER = 'Single Player',
  MULTIPLAYER = 'Multiplayer Online',
  COUCH_COOP = 'Split-screen/Couch'
}
