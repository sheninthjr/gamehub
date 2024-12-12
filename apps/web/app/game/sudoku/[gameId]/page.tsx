"use client";

import { useSocket } from "@/hooks/useSocket";
import { useState, useEffect, useRef } from "react";
import { Toaster, toast } from "react-hot-toast";

export default function GameId({ params }: { params: { gameId: string } }) {
  const [board, setBoard] = useState<number[][]>([]);
  const socket = useSocket();
  const [gameId, setGameId] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(5 * 60);

  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const popupRef = useRef<HTMLDivElement>(null);

  const gridSectionColors = [
    "border-blue-500",
    "border-green-500",
    "border-red-500",
    "border-purple-500",
    "border-yellow-500",
    "border-indigo-500",
    "border-pink-500",
    "border-teal-500",
    "border-orange-500",
  ];

  const gridSectionTextColors = [
    "text-blue-500",
    "text-green-500",
    "text-red-500",
    "text-purple-500",
    "text-yellow-500",
    "text-indigo-500",
    "text-pink-500",
    "text-teal-500",
    "text-orange-500",
  ];

  const gridSectionHoverColors = [
    "hover:border-blue-600",
    "hover:border-green-600",
    "hover:border-red-600",
    "hover:border-purple-600",
    "hover:border-yellow-600",
    "hover:border-indigo-600",
    "hover:border-pink-600",
    "hover:border-teal-600",
    "hover:border-orange-600",
  ];

  function init() {
    if (socket) {
      socket.send(
        JSON.stringify({
          type: "sudoku_join",
        }),
      );
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
      if (timeLeft === 45) {
        toast("45 seconds left", {
          icon: "⏰",
          duration: 3000,
          position: "bottom-center",
        });
      }
      if (timeLeft === 0) {
        toast.error("Time's up!");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    if (socket) {
      init();
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "game_started") {
          setGameId(data.payload.gameId);
          setBoard(data.payload.board);
        }
        if (data.type === "sudoku_correct_move") {
          const row = data.payload.row;
          const col = data.payload.col;
          const num = data.payload.num;
          setBoard((prev) => {
            const newBoard = [...prev];
            newBoard[row][col] = num;
            return newBoard;
          });
        }
        if (data.type === "sudoku_invalid_move") {
          setMessage(data.payload.message);
          toast.error(data.payload.message);
        }
        if (data.type === "sudoku_game_completed") {
          setMessage(data.payload.message);
          toast.success(data.payload.message);
        }
      };
    }
  }, [socket]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectedCell &&
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setSelectedCell(null);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedCell(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEscapeKey);
    };
  }, [selectedCell]);

  const handleClick = (row: number, col: number) => {
    if (board[row][col] === 0) {
      setSelectedCell({ row, col });
    }
  };

  const handleNumberSelect = (number: number) => {
    if (selectedCell) {
      if (socket) {
        socket.send(
          JSON.stringify({
            type: "sudoku_click",
            payload: {
              row: selectedCell.row,
              col: selectedCell.col,
              gameId,
              num: number,
            },
          }),
        );
      }
      setSelectedCell(null);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col lg:flex-row justify-evenly items-center max-w-6xl mx-auto pt-32 relative">
      <Toaster
        position="bottom-center"
        toastOptions={{
          className: "font-bold",
        }}
      />
      <div className="relative">
        <div className="flex flex-col justify-center items-center">
          <div className="font-montserrat text-5xl font-extrabold self-center">
            SUDOKU
          </div>
          <div className="font-montserrat text-xl mt-2">
            Time Left: <span className="font-bold">{formatTime(timeLeft)}</span>
          </div>
        </div>
        <div className="grid grid-cols-9 gap-2 mt-4">
          {board.map((row, rowIndex) =>
            row.map((col, colIndex) => {
              const gridSectionIndex =
                Math.floor(rowIndex / 3) * 3 + Math.floor(colIndex / 3);
              return (
                <div key={`${rowIndex}-${colIndex}`} className="relative">
                  <button
                    onClick={() => handleClick(rowIndex, colIndex)}
                    disabled={col !== 0}
                    className={`
                    w-14 h-14 
                    border-2 border-solid 
                    rounded-2xl 
                    flex justify-center items-center 
                    text-4xl font-extrabold
                    ${gridSectionColors[gridSectionIndex]}
                    hover:opacity-80
                    transition-all
                    duration-200
                    ${col !== 0 ? "cursor-not-allowed opacity-80" : "cursor-pointer"}
                  `}
                  >
                    {col === 0 ? "" : col}
                  </button>

                  {selectedCell &&
                    selectedCell.row === rowIndex &&
                    selectedCell.col === colIndex && (
                      <div
                        ref={popupRef}
                        className="absolute z-50 top-full mt-2 left-1/2 transform -translate-x-1/2 
                    bg-black/90
                    rounded-lg shadow-lg p-2 flex flex-wrap gap-1 
                    justify-center items-center w-64"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
                          <button
                            key={number}
                            onClick={() => handleNumberSelect(number)}
                            className={`
                            w-10 h-10 
                            ${gridSectionColors[gridSectionIndex]}
                            ${gridSectionHoverColors[gridSectionIndex]}
                            ${gridSectionTextColors[gridSectionIndex]}
                            border
                            rounded-md 
                            transition-colors 
                            duration-200
                          `}
                          >
                            {number}
                          </button>
                        ))}
                      </div>
                    )}
                </div>
              );
            }),
          )}
        </div>
      </div>
    </div>
  );
}
