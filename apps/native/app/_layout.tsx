import { Stack } from "expo-router";
import "../global.css";
import { Navbar } from "@/components/Navbar";
import { SafeAreaView } from "react-native";

export default function Layout() {
  return (
    <SafeAreaView className="bg-[#0A0A0A] h-screen">
      <Navbar />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
      </Stack>
    </SafeAreaView>
  );
}
