import React from "react";
import OrdersScreenContainer from "@/screens/OrdersScreen/OrdersScreenContainer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { Provider as PaperProvider } from "react-native-paper";

export default function MenuScreen() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <OrdersScreenContainer />
    </GestureHandlerRootView>
  );
}
