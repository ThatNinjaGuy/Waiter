import React, { useState, useContext } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import OrdersScreen from "./OrdersScreen";
import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";
import { View } from "react-native";
import AuthContext from "@/components/Authentication/AuthProvider";
import AuthScreen from "@/screens/AuthScreen/AuthScreen";
import { updateOrderStatus } from "@/firebase/queries/tables";

const OrdersScreenContainer = () => {
  const { user, liveOrders } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handleUpdateOrderStatus = async (orderId, tableId, newStatus) => {
    await updateOrderStatus(orderId, tableId, newStatus);
  };

  if (!user) return <AuthScreen />;

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={{ flex: 1 }}>
      <OrdersScreen
        orders={liveOrders}
        updateOrderStatus={handleUpdateOrderStatus}
        user={user}
      />
    </View>
  );
};

export default OrdersScreenContainer;
