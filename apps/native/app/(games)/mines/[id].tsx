import { useSocket } from "@/hooks/useSocket";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState, useCallback } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from "react-native";

export default function Mines() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const userId = "774d1cc1-4455-41ce-859f-2a27de47756c";
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
  const [refreshing, setRefreshing] = useState(false);

  const resetGameState = useCallback(() => {
    setGameId("");
    setBoard([
      ["-", "-", "-", "-"],
      ["-", "-", "-", "-"],
      ["-", "-", "-", "-"],
      ["-", "-", "-", "-"],
    ]);
    setIsDisabled(false);
    setPoints(0);
    setStatus("");
    setMessage("");
    setGameOverCell(null);
    setCorrectCells([]);
  }, []);

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
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    resetGameState();
    init();
    if (socket) {
      socket.sendMessage({
        type: "mines_leave",
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

  const getCellStyle = (rowIndex: number, colIndex: number) => {
    if (gameOverCell?.row === rowIndex && gameOverCell?.col === colIndex) {
      return "bg-red-500";
    }
    if (
      correctCells.some(
        (cell) => cell.row === rowIndex && cell.col === colIndex,
      )
    ) {
      return "bg-green-500";
    }
    return "bg-gray-800";
  };

  return (
    <ScrollView
      className="bg-[#0A0A0A] flex-1"
      contentContainerStyle={{
        flexGrow: 1,
        paddingHorizontal: 10,
      }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={["blue"]}
          tintColor="blue"
        />
      }
    >
      <TouchableOpacity onPress={handleBackPress}>
        <Ionicons name="arrow-back-circle" size={35} color="white" />
      </TouchableOpacity>
      <View className="flex-row justify-center items-center mb-4">
        <Text className="text-white font-bold text-7xl">MINES</Text>
      </View>
      <View className="flex justify-center items-center mb-4 gap-3">
        <Text className="text-white text-2xl">Message</Text>
        <Text className="text-neutral-400 self-center text-2xl text-center bg-gray-900 p-2 rounded-xl">
          {message || "Welcome to Mines"}
        </Text>
        <Text className="bg-yellow-500 text-lg text-white py-1 px-2 rounded-lg font-bold">
          Points: {points}
        </Text>
      </View>
      <View className="flex-row flex-wrap justify-center">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <TouchableOpacity
              key={`${rowIndex}-${colIndex}`}
              onPress={() => handleClick(rowIndex, colIndex)}
              disabled={cell !== "-" || isDisabled}
              className={`
                w-24 h-24 m-1 rounded-xl justify-center items-center
                ${getCellStyle(rowIndex, colIndex)}
                ${cell !== "-" ? "opacity-100" : "opacity-70"}
              `}
            >
              <Text className="text-white text-2xl font-bold">
                {cell !== "-" ? cell : ""}
              </Text>
            </TouchableOpacity>
          )),
        )}
      </View>
    </ScrollView>
  );
}
