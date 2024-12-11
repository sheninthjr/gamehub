"use client";

import { useSocket } from "@/hooks/useSocket";
import { GAME_TYPE } from "@/types";
import { Send, SendHorizonal } from "lucide-react";
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
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<
    { playerId: string; message: string }[]
  >([]);
  const [resultStatus, setResultStatus] = useState<"win" | "draw">();

  const [board, setBoard] = useState<string[][]>([
    ["-", "-", "-"],
    ["-", "-", "-"],
    ["-", "-", "-"],
  ]);

  function initJoin() {
    socket?.send(
      JSON.stringify({
        type: "join_xoxo",
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
          const result = data.payload.result;
          setResultStatus(result);
          setGameStatus("FINISHED");
        }
        if (data.type === "chat_message") {
          setMessages((prev) => [
            ...prev,
            { playerId: data.payload.playerId, message: data.payload.message },
          ]);
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

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = () => {
    if (chatInput.trim()) {
      socket?.send(
        JSON.stringify({
          type: "chat_message",
          payload: {
            gameId,
            playerId: userId,
            message: chatInput.trim(),
          },
        })
      );
    }
    setChatInput("");
  };

  return (
    <div className="flex flex-col lg:flex-row justify-evenly items-center max-w-6xl mx-auto pt-32">
      <div className="">
        <div className="flex flex-col justify-center">
          <div className="font-montserrat text-5xl font-extrabold self-center">
            XOXO
          </div>
          <div className="self-center">
            You're <span className="font-extrabold text-lg">{symbol}</span>
          </div>
        </div>
        {gameStatus === "FINISHED" ? (
          <div className="flex flex-col justify-center items-center max-w-6xl mx-auto pt-32">
          <div className="text-lg md:text-4xl text-white font-extrabold flex justify-center items-center w-full h-32 rounded-lg shadow-lg">
            {resultStatus === "draw"
              ? "The match is a draw"
              : `The winner of the match is ${lastMove}`}
          </div>
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
      <div className="bg-[#202020] self-center flex flex-col justify-between h-96 w-[90%] md:w-[60%] lg:w-[40%] lg:h-[50vh] mt-20 rounded-xl text-white p-5">
        <div className="flex flex-col-reverse h-full overflow-y-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 flex ${
                msg.playerId === userId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 max-w-[70%] flex font-semibold justify-center items-center self-center gap-2 rounded-lg text-sm ${
                  msg.playerId === userId
                    ? "bg-white/20 text-white self-end"
                    : "bg-gray-100 text-black self-start"
                }`}
              >
                {msg.message}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="w-full p-2 text-white bg-white/10 outline-none rounded-xl"
          />
          <button onClick={sendMessage} className="bg-white/10 p-2 rounded-xl">
            <SendHorizonal />
          </button>
        </div>
      </div>
    </div>
  );
}
