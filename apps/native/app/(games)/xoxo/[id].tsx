import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSocket } from "@/hooks/useSocket";

export default function GameId() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [gameId, setGameId] = useState("");
  const userId = "774d1cc1-4455-41ce-859f-2a27de47756c";
  const [symbol, setSymbol] = useState<string>("");
  const socket = useSocket();
  const [lastMove, setLastMove] = useState<"X" | "O" | string>("");
  const [gameStatus, setGameStatus] = useState("WAITING");
  const [isDisabled, setIsDisabled] = useState<true | false>(true);
  const [resultStatus, setResultStatus] = useState<"win" | "draw">();
  const [refreshing, setRefreshing] = useState(false);

  const [board, setBoard] = useState<string[][]>([
    ["-", "-", "-"],
    ["-", "-", "-"],
    ["-", "-", "-"],
  ]);

  function init() {
    if (socket) {
      socket?.sendMessage({
        type: "xoxo_join",
        payload: {
          id,
        },
      });
    }
  }

  const resetGameState = useCallback(() => {
    setGameId("");
    setBoard([
      ["-", "-", "-"],
      ["-", "-", "-"],
      ["-", "-", "-"],
      ["-", "-", "-"],
    ]);
    setIsDisabled(false);
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    resetGameState();
    init();
    if (socket) {
      socket.sendMessage({
        type: "xoxo_leave",
        payload: {
          id,
        },
      });
    }
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, [resetGameState, init]);

  const handleBackPress = () => {
    resetGameState();
    handleRefresh();
    router.push("/");
  };

  useEffect(() => {
    if (socket) {
      init();
      const handler = (data: any) => {
        if (data.type === "xoxo_game_started") {
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
        if (data.type === "xoxo_move_made") {
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
        if (data.type === "xoxo_game_over") {
          const winner = data.payload.symbol;
          const result = data.payload.result;
          setResultStatus(result);
          setGameStatus("FINISHED");
        }
      };
      const unsubscribe = socket.addMessageHandler(handler);
      return () => {
        unsubscribe();
        socket.sendMessage({
          type: "xoxo_leave",
          payload: {
            id,
          },
        });
        socket.removeMessageHandler(handler);
      };
    }
  }, [socket]);

  const handleClick = (row: number, col: number) => {
    if (board[row][col] === "-" && socket) {
      if (lastMove === symbol) {
        return;
      }
      if (gameStatus === "FINISHED") {
        return;
      }
      const newBoard = [...board];
      newBoard[row][col] = symbol;
      setBoard(newBoard);
      socket.sendMessage({
        type: "xoxo_moving",
        payload: {
          gameId,
          playerId: userId,
          row,
          col,
          symbol,
        },
      }),
        setLastMove(symbol);
      setGameStatus("PROGRESS");
    } else {
      console.log("Cell is occupied");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0A0A0A] pt-4 ">
      <View className="flex flex-row justify-start items-center pb-2 ml-4">
        <TouchableOpacity onPress={handleBackPress}>
          <Ionicons name="arrow-back-circle" size={35} color="white" />
        </TouchableOpacity>
        <Text className="text-white font-bold text-5xl absolute left-1/2 transform -translate-x-1/2">
          SUDOKU
        </Text>
      </View>
      <View className="flex-1 items-center">
        <Text className="text-white text-lg mb-4">
          You're <Text className="font-bold">{symbol}</Text>
        </Text>
        {gameStatus === "FINISHED" ? (
          <View className="items-center justify-center mt-8">
            <Text className="text-white text-2xl font-bold text-center">
              {resultStatus === "draw"
                ? "The match is a draw"
                : `The winner of the match is ${lastMove}`}
            </Text>
          </View>
        ) : (
          <View className="mt-4 flex-row flex-wrap justify-center">
            {board.map((row, rowIndex) =>
              row.map((col, colIndex) => (
                <TouchableOpacity
                  key={`${rowIndex}-${colIndex}`}
                  onPress={() => handleClick(rowIndex, colIndex)}
                  disabled={col !== "-" || isDisabled}
                  className="w-32 h-32 border-2 border-white rounded-2xl justify-center items-center m-1"
                >
                  <Text className="text-white text-3xl font-bold">
                    {col === "-" ? "" : col}
                  </Text>
                </TouchableOpacity>
              )),
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
