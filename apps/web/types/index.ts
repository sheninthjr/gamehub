import { UUID } from "crypto";

export type GameCategory = "Puzzle" | "Strategy" | "Education";
export type DifficultyLevel = "Easy" | "Medium" | "Hard";
export type GameType = "Multiplayer" | "SinglePlayer";

export interface MockData {
  id: UUID;
  images: string;
  title: "mines" | "xoxo" | "sudoku" | "codehub";
  winningprobability: number;
  description: string;
  category: GameCategory;
  difficulty: DifficultyLevel;
  gameType: GameType;
}

export type GAME_TYPE = "WAITING" | "STARTED" | "PROGRESS" | "FINISHED";

export type stateBoolean = true | false;

export type LANGUAGE_TYPE = "python" | "cpp" | "java" | "javascript";
