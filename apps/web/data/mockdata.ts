import { MockData } from "@/types";

export const mockdata: MockData[] = [
  {
    id: "355a5c37-c2ba-481c-bdd3-99f4828aa49e",
    images: "/mines.webp",
    title: "mines",
    winningprobability: 0.8,
    category: "Puzzle",
    difficulty: "Medium",
    gameType: "SinglePlayer",
  },
  {
    id: "141d4980-c376-4fe8-8c5b-11b1f6ab7196",
    images: "/xoxo.webp",
    title: "xoxo",
    winningprobability: 0.5,
    category: "Strategy",
    difficulty: "Easy",
    gameType: "Multiplayer",
  },
  {
    id: "3eb59008-c962-4320-9904-84c5257e8c8d",
    images: "/sudoku.png",
    title: "sudoku",
    winningprobability: 0.4,
    category: "Puzzle",
    difficulty: "Hard",
    gameType: "SinglePlayer",
  },
  {
    id: "ecdb7264-a27e-4318-947d-e87f2e8e9417",
    images: "/codebug.webp",
    title: "codehub",
    winningprobability: 0.3,
    category: "Education",
    difficulty: "Hard",
    gameType: "SinglePlayer",
  },
];
