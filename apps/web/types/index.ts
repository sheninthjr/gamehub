import { UUID } from "crypto";

export interface MockData {
  id: UUID;
  images: string;
  title: "mines" | "xoxo" | "sudoku" | "codehub";
  playing: string;
  winningprobability: number;
}

export type GAME_TYPE = "WAITING" | "STARTED" | "PROGRESS" | "FINISHED";

export type stateBoolean = true | false;

export type LANGUAGE_TYPE = "python" | "cpp" | "java" | "javascript";
