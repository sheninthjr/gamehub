import { mockdata } from "@/data/mockdata";
import { useSocket } from "@/hooks/useSocket";
import clsx from "clsx";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Home() {
  const router = useRouter();
  const socket = useSocket();
  const [refreshing, setRefreshing] = useState(false);
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

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setLiveUser({
      mines: 0,
      xoxo: 0,
      sudoku: 0,
    });
    init();
  }, [init]);

  useEffect(() => {
    if (socket) {
      init();
      const handler = (data: any) => {
        if (data.type === "welcome") {
          setLiveUser({
            mines: data.payload.mines,
            sudoku: data.payload.sudoku,
            xoxo: data.payload.xoxo,
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

  const handleGameNavigation = (value: any) => {
    router.push({
      pathname: `/(games)/${value.title.toString()}/[id]` as any,
      params: { id: value.id },
    });
  };

  return (
    <ScrollView
      className="bg-[#0A0A0A] h-full p-2"
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
      <ScrollView className="flex flex-col">
        {mockdata.map((value, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleGameNavigation(value)}
            className="bg-[#151516] h-[300px] rounded-xl border border-slate-800 self-center shadow-xl mb-6 w-[90%]"
          >
            <View className="">
              <View className="relative">
                <View>
                  <Image
                    source={{ uri: value.images }}
                    className="h-52 object-cover rounded-t-xl"
                  />
                </View>
                <View className="font-bold absolute text-xl text-white z-10 bottom-4 left-4">
                  <Text className="text-white font-bold text-4xl">
                    {value.title.toUpperCase()}
                  </Text>
                </View>
              </View>
              <View className="py-4 px-2 flex gap-4">
                <View className="flex flex-row justify-start px-2 gap-3 items-center">
                  <Text className="text-green-400 text-2xl">•</Text>
                  <Text className="font-bold text-xl text-neutral-600">
                    {liveUser[value.title as keyof typeof liveUser]} playing
                  </Text>
                </View>
                <View className="w-full border border-neutral-700 p-2 rounded-xl flex flex-row justify-between items-center">
                  <Text className="text-gray-300 text-lg font-semibold">
                    Winning Probability
                  </Text>
                  <Text
                    className={clsx("p-0.5 px-1 text-white rounded-md", {
                      "bg-red-600": value.winningprobability <= 0.3,
                      "bg-yellow-500 text-black":
                        value.winningprobability > 0.3 &&
                        value.winningprobability < 0.7,
                      "bg-green-600": value.winningprobability >= 0.7,
                    })}
                  >
                    {(value.winningprobability * 100).toFixed(1)}%
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ScrollView>
  );
}
