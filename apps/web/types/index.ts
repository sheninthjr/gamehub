import { UUID } from "crypto";

export interface MockData {
  id: UUID;
  images: string;
  title: string;
  playing: string;
  winningprobability: number;
}

export type GAME_TYPE = "WAITING" | "STARTED" | "PROGRESS" | "FINISHED";

export type stateBoolean = true | false;
