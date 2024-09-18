import React, { useState, useEffect, useContext } from "react";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import OrdersScreen from "./OrdersScreen";
import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";
import { View } from "react-native";
import {
  completedOrdersCount,
  activeOrdersCount,
} from "@/utils/orderManagement";
import AuthContext from "@/components/Authentication/AuthProvider";
import AuthScreen from "@/components/Authentication/AuthScreen";
import { playNotificationSounds } from "@/components/Notifications/NotificationSound";

const OrdersScreenContainer = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const tablesRef = collection(
          db,
          "hotel-details/seating-arrangement/tables/"
        );
        const q = query(tablesRef);

        // Set up real-time listener
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const allOrders = [];
          querySnapshot.docs.forEach((doc) => {
            const tableData = doc.data();
            const tableNumber = tableData.number;
            const tableNote = tableData.notes;
            if (tableData.orders) {
              // Add table ID to each order for reference
              const tableOrders = tableData.orders.map((order) => ({
                ...order,
                tableId: doc.id,
                tableNumber: tableNumber,
                tableNote: tableNote,
              }));
              allOrders.push(...tableOrders);
            }
          });

          // Sort orders by timestamp if available
          allOrders.sort(
            (a, b) => (a.orderTimestamp || 0) - (b.orderTimestamp || 0)
          );

          notifyOrdersUpdated(allOrders);

          setOrders(allOrders);
          setLoading(false);
        });

        // Clean up the listener on component unmount
        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const notifyOrdersUpdated = (allOrders) => {
    // If count of order increased, new order has come in. So, notify
    if (activeOrdersCount(orders) < activeOrdersCount(allOrders)) {
      playNotificationSounds();
    }

    // If count of completed orders increased, an order has been completed. So, notify
    if (completedOrdersCount(orders) < completedOrdersCount(allOrders)) {
      playNotificationSounds();
    }
  };

  const updateOrderStatus = async (orderId, tableId, orderStatus) => {
    try {
      // Find the table document
      const tableDocRef = doc(
        db,
        "hotel-details/seating-arrangement/tables/",
        tableId
      );

      // Get the current orders
      const tableSnapshot = await getDoc(tableDocRef);
      const currentOrders = tableSnapshot.data().orders;

      // Find the order to update
      const updatedOrders = currentOrders.map((order) =>
        order.id === orderId ? { ...order, status: orderStatus } : order
      );

      // Update the orders array in Firestore
      await updateDoc(tableDocRef, { orders: updatedOrders });

      // Update local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: orderStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const { user } = useContext(AuthContext);
  if (!user) return <AuthScreen />;

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={{ flex: 1 }}>
      <OrdersScreen
        orders={orders}
        updateOrderStatus={updateOrderStatus}
        user={user}
      />
    </View>
  );
};

export default OrdersScreenContainer;
