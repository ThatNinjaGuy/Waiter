import React, { useState, useEffect } from "react";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { ThemedText } from "@/components/common/ThemedText";
import OrdersScreen from "./OrdersScreen";

const OrdersScreenContainer = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const tablesRef = collection(db, "tables");
        const q = query(tablesRef);

        // Set up real-time listener
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const allOrders = [];
          querySnapshot.docs.forEach((doc) => {
            const tableData = doc.data();
            const tableNumber = tableData.number;
            const tableNote = tableData.notes;
            if (tableData.orders && Array.isArray(tableData.orders)) {
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
            (a, b) =>
              (b.timestamp?.toMillis() || 0) - (a.timestamp?.toMillis() || 0)
          );

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

  const handleCompleteOrder = async (orderId, tableId) => {
    console.log(
      `Order from ${tableId} with orderId: ${orderId} marked as complete`
    );
    try {
      // Find the table document
      const tableDocRef = doc(db, "tables", tableId);

      // Get the current orders
      const tableSnapshot = await getDoc(tableDocRef);
      const currentOrders = tableSnapshot.data().orders;

      // Find the order to update
      const updatedOrders = currentOrders.map((order) =>
        order.id === orderId ? { ...order, status: "COMPLETE" } : order
      );

      // Update the orders array in Firestore
      await updateDoc(tableDocRef, { orders: updatedOrders });

      // Update local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: "COMPLETE" } : order
        )
      );
      console.log(`Order ${orderId} marked as COMPLETE`);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  if (loading) {
    return <ThemedText>Loading orders...</ThemedText>;
  }

  return (
    <>
      <OrdersScreen orders={orders} onCompleteOrder={handleCompleteOrder} />
    </>
  );
};

export default OrdersScreenContainer;
