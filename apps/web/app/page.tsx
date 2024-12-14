"use client";
import { mockdata } from "@/data/mockdata";
import { useSocket } from "@/hooks/useSocket";
import { MockData } from "@/types";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const socket = useSocket();
  const [liveUser, setLiveUser] = useState({
    mines: 0,
    xoxo: 0,
    sudoku: 0,
  });

  function init() {
    if (socket) {
      socket.sendMessage({
        type: "welcome",
      });
    }
  }

  useEffect(() => {
    if (socket) {
      init();
      const handler = (data: any) => {
        if (data.type === "welcome") {
          setLiveUser({
            mines: data.payload.mines,
            xoxo: data.payload.xoxo,
            sudoku: data.payload.sudoku,
          });
        }
      };
      const unsubscribe = socket.addMessageHandler(handler);
      return () => {
        unsubscribe();
        socket.removeMessageHandler(handler);
      };
    }
  }, [socket]);

  const handleClick = (value: MockData) => {
    router.push(`/game/${value.title.toLowerCase()}/${value.id}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 pt-32 gap-y-9 max-w-6xl mx-auto justify-items-center p-8 auto-rows-min">
      {mockdata.map((value, index) => (
        <div
          key={index}
          className="h-80 w-80 bg-secondary rounded-xl border border-slate-800 shadow-xl"
        >
          <button onClick={() => handleClick(value)} className="">
            <div className="relative">
              <img
                src={value.images}
                alt="thumbnail"
                className="w-80 h-52 object-cover rounded-xl"
              />
              <div className="font-bold absolute text-xl text-white z-10 bottom-4 left-4 font-montserrat">
                {value.title.toUpperCase()}
              </div>
            </div>
            <div className="p-4 flex flex-col space-y-3">
              <div className="flex gap-3 items-center font-mono relative">
                <div className="text-green-500 text-4xl animate-pulse absolute">
                  •
                </div>
                <div className="ml-5 mb-1 font-light text-neutral-400 text-sm">
                  {liveUser[value.title as keyof typeof liveUser]} playing
                </div>
              </div>
              <div className="border border-neutral-800 rounded-xl text-sm py-2 flex justify-between w-full px-3 items-center gap-3">
                <span>Winning Probability</span>
                <span
                  className={clsx("p-0.5 px-1 rounded-md", {
                    "bg-red-600": value.winningprobability <= 0.3,
                    "bg-yellow-500":
                      value.winningprobability > 0.3 &&
                      value.winningprobability < 0.7,
                    "bg-green-600": value.winningprobability >= 0.7,
                  })}
                >
                  {value.winningprobability}
                </span>
              </div>
            </div>
          </button>
        </div>
      ))}
    </div>
  );
}
