import React from "react";
import RestaurantTablesScreen from "@/screens/TablesScreen/RestaurantTablesScreen";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function MenuScreen() {
  return (
    // <GestureHandlerRootView style={{ flex: 1 }}>
    <RestaurantTablesScreen />
    // </GestureHandlerRootView>
  );
}
