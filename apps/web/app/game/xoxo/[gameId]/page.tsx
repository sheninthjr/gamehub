"use client";

import { useSocket } from "@/hooks/useSocket";
import { GAME_TYPE } from "@/types";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function GameId({ params }: { params: { gameId: string } }) {
  const [gameId, setGameId] = useState("");
  const { data: session } = useSession();
  const userId = session?.user.id;
  const [symbol, setSymbol] = useState<string>("");
  const socket = useSocket();
  const [lastMove, setLastMove] = useState<"X" | "Y" | string>("");
  const [gameStatus, setGameStatus] = useState<GAME_TYPE>("WAITING");
  const [isDisabled, setIsDisabled] = useState<true | false>(true);

  const [board, setBoard] = useState<string[][]>([
    ["-", "-", "-"],
    ["-", "-", "-"],
    ["-", "-", "-"],
  ]);

  function initJoin() {
    socket?.send(
      JSON.stringify({
        type: "join",
      })
    );
  }

  useEffect(() => {
    if (socket) {
      initJoin();
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "game_started") {
          const player1 = data.payload.player1;
          setGameId(data.payload.gameId);
          if (player1 === userId) {
            setSymbol("X");
          } else {
            setSymbol("O");
          }
          setGameStatus("STARTED");
          setIsDisabled(false);
        }
        if (data.type === "move_made") {
          const row = data.payload.row;
          const col = data.payload.col;
          const symbol = data.payload.symbol;
          setBoard((prev) => {
            const newBoard = [...prev];
            newBoard[row][col] = symbol;
            return newBoard;
          });
          setLastMove(symbol);
          setGameStatus("PROGRESS");
        }
        if (data.type === "game_over") {
          const winner = data.payload.symbol;
          setGameStatus("FINISHED");
        }
      };
    }
  }, [socket]);

  const handleClick = (row: number, col: number) => {
    if (board[row][col] === "-") {
      if (lastMove === symbol) {
        return;
      }
      if (gameStatus === "FINISHED") {
        return;
      }
      const newBoard = [...board];
      newBoard[row][col] = symbol;
      setBoard(newBoard);
      socket?.send(
        JSON.stringify({
          type: "moving",
          payload: {
            gameId,
            playerId: userId,
            row,
            col,
            symbol,
          },
        })
      );
      setLastMove(symbol);
      setGameStatus("PROGRESS");
    } else {
      console.log("Cell is occupied");
    }
  };

  return (
    <div className="flex flex-col justify-start items-center h-screen">
      <div className="flex flex-col justify-center">
        <div className="font-montserrat text-5xl font-extrabold pt-32">XOXO</div>
        <div className="self-center">
          You're <span className="font-extrabold text-lg">{symbol}</span>
        </div>
      </div>
      {gameStatus === "FINISHED" ? (
        <div className="text-4xl fixed bg-[rgba(0,0,0,0.7)] font-extrabold flex justify-center h-screen items-center w-full">
          The winner of the match is {lastMove}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2 mt-4">
          {board.map((row, rowIndex) =>
            row.map((col, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleClick(rowIndex, colIndex)}
                disabled={col !== "-" || isDisabled}
                className="w-32 h-32 border-2 border-solid rounded-2xl flex justify-center items-center text-4xl font-extrabold"
              >
                {col === "-" ? "" : col}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
