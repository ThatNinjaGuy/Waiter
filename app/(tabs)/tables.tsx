import React from "react";
import TablesScreen from "@/screens/TablesScreen/TablesScreen";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function MenuScreen() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TablesScreen />
    </GestureHandlerRootView>
  );
}
