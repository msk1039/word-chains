export type GameStatus = "idle" | "playing" | "finished";

export interface PlayedWord {
  id: string;
  value: string;
  pointsAwarded: number;
  length: number;
  multiplierApplied: number;
  createdAt: number;
}

export interface GameState {
  currentLetter: string;
  wordChain: PlayedWord[];
  score: number;
  timeRemaining: number;
  gameStatus: GameStatus;
  lastWordLength: number;
  chainMultiplier: number;
  bestChainMultiplier: number;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}
