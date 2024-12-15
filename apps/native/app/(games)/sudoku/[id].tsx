import { useSocket } from "@/hooks/useSocket";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import Toast from "react-native-toast-message";

const { width } = Dimensions.get("window");
const CELL_SIZE = (width - 50) / 9;

export default function Sudoku() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const socket = useSocket();

  const [board, setBoard] = useState<number[][]>([]);
  const [gameId, setGameId] = useState<string>("");
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const gridSectionColors = [
    "#3B82F6",
    "#10B981",
    "#EF4444",
    "#8B5CF6",
    "#F59E0B",
    "#14B8A6",
    "#EC4899",
    "#6366F1",
    "#F97316",
  ];

  function init() {
    if (socket) {
      socket.sendMessage({
        type: "sudoku_join",
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
        if (data.type === "game_started") {
          setGameId(data.payload.gameId);
          setBoard(data.payload.board);
        }
        if (data.type === "sudoku_correct_move") {
          const { row, col, num } = data.payload;
          setBoard((prev) => {
            const newBoard = [...prev];
            newBoard[row][col] = num;
            return newBoard;
          });
        }
        if (data.type === "sudoku_invalid_move") {
          Toast.show({
            type: "error",
            text1: data.payload.message,
            position: "top",
          });
        }
        if (data.type === "sudoku_game_completed") {
          Toast.show({
            type: "success",
            text1: data.payload.message,
            position: "bottom",
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

  const handleClick = (row: number, col: number) => {
    if (board[row][col] === 0) {
      setSelectedCell({ row, col });
    }
  };

  const handleExit = useCallback(() => {
    setBoard([]);
    setGameId("");
    setSelectedCell(null);
    if (socket) {
      socket.sendMessage({
        type: "sudoku_leave",
        payload: {
          id,
        },
      });
    }
    router.push("/");
  }, [socket, id, gameId, router]);

  const handleNumberSelect = (number: number) => {
    if (selectedCell) {
      if (socket) {
        socket.sendMessage({
          type: "sudoku_click",
          payload: {
            row: selectedCell.row,
            col: selectedCell.col,
            gameId,
            num: number,
          },
        });
      }
      setSelectedCell(null);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const getGridSectionColor = (rowIndex: number, colIndex: number) => {
    const gridSectionIndex =
      Math.floor(rowIndex / 3) * 3 + Math.floor(colIndex / 3);
    return gridSectionColors[gridSectionIndex];
  };

  const getGridSectionColorCell = (rowIndex: number, colIndex: number) => {
    const gridSectionIndex =
      Math.floor(rowIndex / 3) * 3 + Math.floor(colIndex / 3);
    return gridSectionColors[gridSectionIndex];
  };

  return (
    <View className="bg-[#0A0A0A] h-screen pl-3 pt-14 relative">
      <View className="flex flex-row justify-start items-center pb-4">
        <TouchableOpacity onPress={handleExit}>
          <Ionicons name="arrow-back-circle" size={35} color="white" />
        </TouchableOpacity>
        <Text className="text-white font-bold text-5xl absolute left-1/2 transform -translate-x-1/2">
          SUDOKU
        </Text>
      </View>

      <View className="items-center">
        <View className="flex-row flex-wrap w-full justify-center mt-4">
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const gridColor = getGridSectionColor(rowIndex, colIndex);
              return (
                <TouchableOpacity
                  key={`${rowIndex}-${colIndex}`}
                  onPress={() => handleClick(rowIndex, colIndex)}
                  disabled={cell !== 0}
                  style={[
                    styles.cell,
                    {
                      backgroundColor:
                        cell !== 0 ? "rgba(255,255,255,0.1)" : "transparent",
                      borderColor: gridColor,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.cellText,
                      { color: cell !== 0 ? gridColor : "white" },
                    ]}
                  >
                    {cell === 0 ? "" : cell}
                  </Text>
                </TouchableOpacity>
              );
            }),
          )}
        </View>

        {selectedCell && (
          <View className="flex-row flex-wrap w-full justify-center mt-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
              <TouchableOpacity
                key={number}
                onPress={() => handleNumberSelect(number)}
                style={[
                  styles.numberButton,
                  {
                    backgroundColor: getGridSectionColorCell(
                      Math.floor(selectedCell.row / 3) * 3,
                      Math.floor(selectedCell.col / 3) * 3,
                    ),
                  },
                ]}
              >
                <Text style={styles.numberText}>{number}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    margin: 2,
    borderRadius: 10,
  },
  cellText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  numberButton: {
    width: 50,
    height: 50,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    borderRadius: 10,
  },
  numberText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});
