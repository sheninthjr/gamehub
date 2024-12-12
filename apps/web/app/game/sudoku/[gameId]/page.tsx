"use client";

import { useSocket } from "@/hooks/useSocket";
import {
  gridSectionColors,
  gridSectionHoverColors,
  gridSectionTextColors,
} from "@/utils";
import { useState, useEffect, useRef } from "react";

export default function GameId({ params }: { params: { gameId: string } }) {
  const [board, setBoard] = useState<number[][]>([]);
  const socket = useSocket();
  const [gameId, setGameId] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const popupRef = useRef<HTMLDivElement>(null);

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
          alert(message.toString());
        }
        if (data.type === "sudoku_game_completed") {
          setMessage(data.payload.message);
          alert(message);
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

  return (
    <div className="flex flex-col lg:flex-row justify-evenly items-center max-w-6xl mx-auto pt-32 relative">
      <div className="relative">
        <div className="flex flex-col justify-center">
          <div className="font-montserrat text-5xl font-extrabold self-center">
            SUDOKU
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
