import "./global.css";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
        <Stack.Screen
          name="subscription"
          options={{ presentation: "card", title: "Subscriptions" }}
        />
        <Stack.Screen
          name="budget"
          options={{ presentation: "card", title: "Budget" }}
        />
        <Stack.Screen
          name="water"
          options={{ presentation: "card", title: "Water Intake" }}
        />
        <Stack.Screen
          name="medicine"
          options={{ presentation: "card", title: "Medicine" }}
        />
        <Stack.Screen
          name="daily-question"
          options={{ presentation: "card", title: "Daily Question" }}
        />
        <Stack.Screen
          name="habits"
          options={{ presentation: "card", title: "Habits" }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
