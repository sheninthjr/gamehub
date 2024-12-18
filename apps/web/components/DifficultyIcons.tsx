import { DifficultyLevel } from "@/types";
import { Skull, Smile, Star } from "lucide-react";

export function DifficultyIcons({
  difficulty,
}: {
  difficulty: DifficultyLevel;
}) {
  switch (difficulty) {
    case "Easy":
      return (
        <div className=" bg-slate-100 py-1 w-fit px-2 flex gap-2 text-xs justify-center items-center font-medium rounded-lg self-center">
          <Smile className="w-4 h-4 text-green-500" />
          <p className="text-black">{difficulty}</p>
        </div>
      );
    case "Medium":
      return (
        <div className=" bg-slate-100 py-1 w-fit px-2 flex gap-2 text-xs justify-center items-center font-medium rounded-lg self-center">
          <Star className="w-4 h-4 text-yellow-500" />
          <p className="text-black">{difficulty}</p>
        </div>
      );
    case "Hard":
      return (
        <div className=" bg-slate-100 py-1 w-fit px-2 flex gap-2 text-xs justify-center items-center font-medium rounded-lg self-center">
          <Skull className="w-4 h-4 text-red-500" />
          <p className="text-black">{difficulty}</p>
        </div>
      );
  }
}
