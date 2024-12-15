import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Pressable,
  Animated,
  PanResponder,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, usePathname, useRouter } from "expo-router";
import { useState, useRef } from "react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarAnimation = useRef(new Animated.Value(-300)).current;
  const router = useRouter();
  const pathname = usePathname();

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gestureState) => {
        if (gestureState.dx < -50) {
          handleClose();
        }
      },
    }),
  ).current;

  const handleOpen = () => {
    setIsOpen(true);
    Animated.timing(sidebarAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleClose = () => {
    setIsOpen(false);
    Animated.timing(sidebarAnimation, {
      toValue: -300,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const activeRoute = (route: any) => pathname === route;

  return (
    <SafeAreaView>
      <View className="px-4 py-4 bg-[#0E0F11] border border-gray-800 m-1 my-5 rounded-3xl flex flex-col justify-center items-center">
        <View className="w-full flex flex-row justify-between items-center">
          <TouchableOpacity
            onPress={isOpen === true ? handleClose : handleOpen}
          >
            <Ionicons name="apps" size={32} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Link href="/" className="text-white font-bold text-4xl">
              GameHub
            </Link>
          </TouchableOpacity>
          <Image
            source={{
              uri: "https://ideogram.ai/assets/progressive-image/balanced/response/XyQQsN8dTyy4TMEwprAKRQ",
            }}
            style={{
              width: 35,
              height: 35,
              borderRadius: 35 / 2,
            }}
          />
        </View>
      </View>
      <Animated.View
        {...panResponder.panHandlers}
        style={{
          transform: [{ translateX: sidebarAnimation }],
        }}
        className="w-72 rounded-r-xl rounded-tl-xl h-[89vh] mt-24 flex justify-between ml-2 pt-6 bg-[#0E0F11] border border-gray-800 shadow-xl absolute z-30"
      >
        <View className="p-4 flex gap-10">
          {[
            { name: "Home", icon: "home", route: "/" },
            { name: "Dashboard", icon: "folder", route: "/dashboard" },
            { name: "History", icon: "time", route: "/history" },
            { name: "Settings", icon: "settings", route: "/settings" },
          ].map(({ name, icon, route }) => (
            <Pressable
              key={name}
              onPress={() => {
                router.push(route as any);
                handleClose();
              }}
              className={`flex flex-row items-center gap-4 p-3 rounded-lg ${
                activeRoute(route) ? "bg-white/10" : "bg-transparent"
              }`}
              android_ripple={{ color: "gray" }}
            >
              <Ionicons name={icon as any} size={24} color="white" />
              <Text className="font-bold text-2xl text-white">{name}</Text>
            </Pressable>
          ))}
        </View>
        <View className="flex flex-row px-4 items-center p-4 rounded-br-xl border border-slate-800 gap-4">
          <Image
            source={{
              uri: "https://ideogram.ai/assets/progressive-image/balanced/response/XyQQsN8dTyy4TMEwprAKRQ",
            }}
            style={{
              width: 35,
              height: 35,
              borderRadius: 35 / 2,
            }}
          />
          <Text className="text-white font-bold text-2xl">Sheninth Jr</Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}
