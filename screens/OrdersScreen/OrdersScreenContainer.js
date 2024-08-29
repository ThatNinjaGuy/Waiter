import React, { useState, useEffect } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
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

          console.log(allOrders);
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

  const handleCompleteOrder = (orderId) => {
    // Implement your logic to mark an order as complete in Firebase
    console.log(`Order ${orderId} marked as complete`);
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
