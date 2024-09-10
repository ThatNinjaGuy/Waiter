import React from "react";
import ProfileScreen from "@/screens/ProfileScreen/ProfileScreen";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function MenuScreen() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ProfileScreen />
    </GestureHandlerRootView>
  );
}
