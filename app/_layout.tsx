import "react-native-reanimated";
import "../globals.css";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView className="flex-1">
      <Stack
        screenOptions={{
          headerShown: false, // This hides the header for all screens
        }}
      />
    </GestureHandlerRootView>
  );
}
