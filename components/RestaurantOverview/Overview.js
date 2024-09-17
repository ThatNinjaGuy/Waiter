import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/common/ThemedText";
import { ThemedView } from "@/components/common/ThemedView";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { completedOrderPath } from "@/firebase/queries/completedOrder";
import { tablesPath } from "@/firebase/queries/tables";
import { INDIAN_RUPPEE_SYMBOL } from "@/constants/common";
import { ACTIVE_ORDERS } from "@/constants/status/orders";

const Overview = () => {
  const [overviewItems, setOverviewItems] = useState([
    { title: "Active Tables", message: 0 },
    { title: "Active Orders", message: 0 },
    { title: "Closed Orders", message: 0 },
    { title: "Today's Revenue", message: 0 },
    { title: "Last 7 days rev", message: 0 },
    { title: "Last day rev", message: 0 },
  ]);

  useEffect(() => {
    const getCompletedOrderSummary = async () => {
      try {
        const completedOrdersRef = collection(db, completedOrderPath);
        const q = query(completedOrdersRef);

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          let orderCountToday = 0;
          let revenueToday = 0;
          let revenueLastDay = 0;
          let revenueLastWeek = 0;

          // Set current day to midnight
          const now = new Date();
          const midnightToday = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
          );

          const lastDayStart = new Date(midnightToday);
          lastDayStart.setDate(midnightToday.getDate() - 1);

          const lastWeekStart = new Date(midnightToday);
          lastWeekStart.setDate(midnightToday.getDate() - 7);

          querySnapshot.docs.forEach((doc) => {
            const data = doc.data();
            const orderDate = data.bookingTime.toDate();

            // Calculate order count and revenue for today
            if (orderDate >= midnightToday) {
              orderCountToday += data.totalOrders;
              revenueToday += data.orderValue;
            }

            // Calculate revenue for the last day
            if (orderDate >= lastDayStart && orderDate < midnightToday) {
              revenueLastDay += data.orderValue;
            }

            // Calculate revenue for the last week
            if (orderDate >= lastWeekStart && orderDate < midnightToday) {
              revenueLastWeek += data.orderValue;
            }
          });

          /// Update overview items using functional update
          setOverviewItems((prevItems) =>
            prevItems.map((item) => {
              if (item.title === "Today's Revenue") {
                return {
                  ...item,
                  message: INDIAN_RUPPEE_SYMBOL + revenueToday,
                };
              } else if (item.title === "Closed Orders") {
                return { ...item, message: orderCountToday };
              } else if (item.title === "Last day rev") {
                return {
                  ...item,
                  message: INDIAN_RUPPEE_SYMBOL + revenueLastDay,
                };
              } else if (item.title === "Last 7 days rev") {
                return {
                  ...item,
                  message: INDIAN_RUPPEE_SYMBOL + revenueLastWeek,
                };
              }
              return item;
            })
          );
        });

        // Clean up the listener on component unmount
        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching completed order summary:", error);
      }
    };

    const getActiveOrdersSummary = async () => {
      try {
        const tablesRef = collection(db, tablesPath);
        const q = query(tablesRef);
        let activeTables = 0;
        let itemsInKitchen = 0;

        // Set up real-time listener
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          querySnapshot.docs.forEach((doc) => {
            const data = doc.data();
            if (data.status === "Occupied" && data.orders) {
              activeTables++;
              itemsInKitchen = data.orders.filter((order) =>
                ACTIVE_ORDERS.includes(order.status)
              ).length;
            }
          });

          // Update overview items using functional update
          setOverviewItems((prevItems) =>
            prevItems.map((item) => {
              if (item.title === "Active Tables") {
                return { ...item, message: activeTables };
              } else if (item.title === "Active Orders") {
                return { ...item, message: itemsInKitchen };
              }
              return item;
            })
          );
        });
        // Clean up the listener on component unmount
        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching tables:", error);
      }
    };

    getActiveOrdersSummary();
    getCompletedOrderSummary();
  }, []);

  return (
    <ThemedView style={styles.overviewContainer}>
      {overviewItems.map((item) => (
        <ThemedView key={item.title} style={styles.overviewItem}>
          <ThemedText style={styles.itemTitle}>{item.title}</ThemedText>
          <ThemedText style={styles.itemMessage}>{item.message}</ThemedText>
        </ThemedView>
      ))}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  overviewContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginTop: 16,
  },
  overviewItem: {
    width: "45%",
    marginBottom: 16,
    alignItems: "center",
  },
  itemTitle: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  itemMessage: {
    textAlign: "center",
  },
});

export default Overview;
