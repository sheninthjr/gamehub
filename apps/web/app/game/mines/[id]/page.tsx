"use client";
import { useSocket } from "@/hooks/useSocket";
import { BadgeDollarSign } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function GameId() {
  const id = "355a5c37-c2ba-481c-bdd3-99f4828aa49e";
  const { data: session } = useSession();
  const userId = session?.user.id;
  const [gameId, setGameId] = useState<string>("");
  const socket = useSocket();
  const [board, setBoard] = useState<string[][]>([
    ["-", "-", "-", "-"],
    ["-", "-", "-", "-"],
    ["-", "-", "-", "-"],
    ["-", "-", "-", "-"],
  ]);
  const [isDisabled, setIsDisabled] = useState<true | false>(false);
  const [points, setPoints] = useState<number>(0);
  const [status, setStatus] = useState<
    "correct" | "game_over" | "already_clicked" | ""
  >("");
  const [message, setMessage] = useState("");
  const [gameOverCell, setGameOverCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [correctCells, setCorrectCells] = useState<
    { row: number; col: number }[]
  >([]);

  function init() {
    if (socket) {
      socket?.sendMessage({
        type: "mines_join",
        payload: {
          id,
        },
      });
    }
  }

  useEffect(() => {
    if (socket) {
      init();
      const handler = (data: any) => {
        if (data.type === "mines_gameId") {
          setGameId(data.gameId);
        }
        if (data.type === "mines_click") {
          console.log(data);
          setStatus(data.payload.status);
          setMessage(data.payload.message);
          setPoints(data.payload.points);
          const row = data.payload.row;
          const col = data.payload.col;

          if (data.payload.status === "correct") {
            setCorrectCells((prev) => [...prev, { row, col }]);
            setBoard((prev) => {
              const updated = [...prev];
              updated[row][col] = "C";
              return updated;
            });
          } else if (data.payload.status === "game_over") {
            setGameOverCell({ row, col });
            setIsDisabled(true);
          }
        }
      };
      const unsubscribe = socket.addMessageHandler(handler);
      return () => {
        unsubscribe();
        socket.sendMessage({
          type: "mines_leave",
          payload: {
            id,
          },
        });
        socket.removeMessageHandler(handler);
      };
    }
  }, [socket]);

  const handleClick = (row: number, col: number) => {
    if (socket) {
      socket.sendMessage({
        type: "mines_click",
        payload: {
          row,
          col,
          gameId,
        },
      });
    }
    console.log("Clicked");
  };

  return (
    <div className="flex flex-col lg:flex-row justify-evenly items-center max-w-6xl mx-auto pt-32">
      <div>
        <div className="flex flex-col justify-center">
          <div className="font-montserrat text-5xl font-extrabold self-center">
            Mines
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2 mt-4">
          {board.map((row, rowIndex) =>
            row.map((col, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleClick(rowIndex, colIndex)}
                disabled={col !== "-" || isDisabled}
                className={`aspect-square w-20 h-20 md:w-28 md:h-28 hover:scale-110 rounded-xl border border-gray-800 flex justify-center items-center text-4xl font-extrabold relative ${
                  gameOverCell?.row === rowIndex &&
                  gameOverCell?.col === colIndex
                    ? "bg-red-500"
                    : correctCells.some(
                          (cell) =>
                            cell.row === rowIndex && cell.col === colIndex,
                        )
                      ? "bg-green-500"
                      : "bg-white/20"
                }`}
                style={{
                  backgroundImage:
                    "linear-gradient(to bottom, transparent 95%, rgba(0, 0, 0, 0.2))",
                }}
              >
                <div className="absolute bottom-0 left-0 w-full h-2 bg-white/10 rounded-b-xl"></div>
                {col === "-" ? "" : col}
              </button>
            )),
          )}
        </div>
      </div>
      <div className="mt-8 text-center flex flex-col space-y-4">
        <p className="text-lg font-semibold bg-white/10 w-full p-2 rounded-xl">
          Message: {message}
        </p>
        <p className="text-lg font-semibold bg-yellow-500 rounded-xl w-fit px-2 py-1 flex self-center justify-center items-center gap-1">
          Points: {points}
          <BadgeDollarSign />{" "}
        </p>
      </div>
    </div>
  );
}
