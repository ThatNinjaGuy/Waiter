import React, { useState, useContext } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import OrdersScreen from "./OrdersScreen";
import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";
import { View } from "react-native";
import AuthContext from "@/components/Authentication/AuthProvider";
import AuthScreen from "@/screens/AuthScreen/AuthScreen";
import { tablesPath } from "@/firebase/queries/tables";

const OrdersScreenContainer = () => {
  const { user, liveOrders } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const updateOrderStatus = async (orderId, tableId, orderStatus) => {
    try {
      // Find the table document
      const tableDocRef = doc(db, tablesPath, tableId);

      // Get the current orders
      const tableSnapshot = await getDoc(tableDocRef);
      const currentOrders = tableSnapshot.data().orders;

      // Find the order to update
      const updatedOrders = currentOrders.map((order) =>
        order.id === orderId ? { ...order, status: orderStatus } : order
      );

      // Update the orders array in Firestore
      await updateDoc(tableDocRef, { orders: updatedOrders });
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  if (!user) return <AuthScreen />;

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={{ flex: 1 }}>
      <OrdersScreen
        orders={liveOrders}
        updateOrderStatus={updateOrderStatus}
        user={user}
      />
    </View>
  );
};

export default OrdersScreenContainer;
