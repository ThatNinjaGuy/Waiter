import React, { useState, useContext } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import OrdersScreen from "./OrdersScreen";
import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";
import { View } from "react-native";
import {
  completedOrdersCount,
  activeOrdersCount,
  extractOrdersFromTable,
} from "@/utils/orderManagement";
import AuthContext from "@/components/Authentication/AuthProvider";
import AuthScreen from "@/components/Authentication/AuthScreen";
import { playNotificationSounds } from "@/components/Notifications/NotificationSound";
import { tablesPath } from "@/firebase/queries/tables";

const OrdersScreenContainer = () => {
  const { user, liveTables } = useContext(AuthContext);
  const liveOrders = extractOrdersFromTable(liveTables);
  const [loading, setLoading] = useState(false);

  const notifyOrdersUpdated = (allOrders) => {
    // If count of order increased, new order has come in. So, notify
    if (activeOrdersCount(liveOrders) < activeOrdersCount(allOrders)) {
      playNotificationSounds();
    }

    // If count of completed orders increased, an order has been completed. So, notify
    if (completedOrdersCount(liveOrders) < completedOrdersCount(allOrders)) {
      playNotificationSounds();
    }
  };

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
