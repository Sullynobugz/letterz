export type GameMode = 'points' | 'ko';

export type GameStatus = 'idle' | 'running' | 'ended';

export type Language = 'en' | 'de';

export interface Settings {
  language: Language;
  mode: GameMode;
  turnSeconds: number;
  skipHardLetters: boolean;
}

export interface Player {
  id: string;
  name: string;
  score: number;
  isOut: boolean;
}

export interface Turn {
  playerId: string;
  letter: string;
  answer: string;
  points: number;
  timestamp: number;
}

export interface GameState {
  status: GameStatus;
  category: string;
  players: Player[];
  availableLetters: string[];
  usedLetters: string[];
  currentPlayerIndex: number;
  selectedLetter: string | null;
  turns: Turn[];
  timerSecondsLeft: number;
  timerRunning: boolean;
  timerPaused: boolean;
}

export interface SetupData {
  category: string;
  playerNames: string[];
}
