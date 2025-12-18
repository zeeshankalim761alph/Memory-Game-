export interface CardType {
  id: number;
  content: string; // Emoji or Image URL
  isFlipped: boolean;
  isMatched: boolean;
}

export enum GameMode {
  CLASSIC = 'Classic',
  REMEMBER = 'Remember',
}

export enum GameStatus {
  IDLE = 'IDLE',
  PREVIEW = 'PREVIEW',
  PLAYING = 'PLAYING',
  WON = 'WON',
}

export interface GameStatsProps {
  moves: number;
  timeElapsed: number;
  bestTime: number | null;
}
