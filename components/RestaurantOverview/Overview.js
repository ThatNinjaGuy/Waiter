import React, { useEffect, useState, useContext } from "react";
import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/common/ThemedText";
import { ThemedView } from "@/components/common/ThemedView";
import { Platform } from "react-native";
import { db } from "@/firebase/firebaseConfig";
import { completedOrderPath } from "@/firebase/queries/completedOrder";
import { INDIAN_RUPPEE_SYMBOL } from "@/constants/common";
import {
  ACTIVE_ORDERS,
  IN_KITCHEN_ORDERS,
  ORDERS_PENDING_ACTION,
} from "@/constants/status/orders";
import {
  getActiveTablesTranslation,
  getActiveOrdersTranslation,
  getInKitchenOrdersTranslation,
  getPendingOrdersTranslation,
  getCompletedBookingsTranslation,
  getRevenueTodayTranslation,
} from "@/utils/appText/homeScreen";
import AuthContext from "@/components/Authentication/AuthProvider";

const Overview = ({ preferredLanguage }) => {
  const { liveTables, liveOrders } = useContext(AuthContext);
  const ACTIVE_TABLES_TEXT = getActiveTablesTranslation(preferredLanguage);
  const ACTIVE_ORDERS_TEXT = getActiveOrdersTranslation(preferredLanguage);
  const IN_KITCHEN_ORDERS_TEXT =
    getInKitchenOrdersTranslation(preferredLanguage);
  const PENDING_ORDERS_TEXT = getPendingOrdersTranslation(preferredLanguage);
  const COMPLETED_BOOKINGS_TEXT =
    getCompletedBookingsTranslation(preferredLanguage);
  const REVENUE_TODAY_TEXT = getRevenueTodayTranslation(preferredLanguage);

  const [overviewItems, setOverviewItems] = useState([
    { title: ACTIVE_TABLES_TEXT, message: 0 },
    { title: ACTIVE_ORDERS_TEXT, message: 0 },
    { title: IN_KITCHEN_ORDERS_TEXT, message: 0 },
    { title: PENDING_ORDERS_TEXT, message: 0 },
    { title: COMPLETED_BOOKINGS_TEXT, message: 0 },
    { title: REVENUE_TODAY_TEXT, message: 0 },
  ]);

  useEffect(() => {
    const getCompletedOrderSummary = async () => {
      try {
        let unsubscribe;

        if (Platform.OS === "web") {
          const { collection, query, onSnapshot } = await import(
            "firebase/firestore"
          );
          const completedOrdersRef = collection(db, completedOrderPath);
          const q = query(completedOrdersRef);
          unsubscribe = onSnapshot(q, handleQuerySnapshot);
        } else {
          // Android/iOS
          const completedOrdersRef = db.collection(completedOrderPath);
          unsubscribe = completedOrdersRef.onSnapshot(handleQuerySnapshot);
        }

        // Clean up the listener on component unmount
        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching completed order summary:", error);
      }
    };

    const handleQuerySnapshot = (querySnapshot) => {
      let orderCountToday = 0;
      let revenueToday = 0;

      // Set current day to midnight
      const midnightToday = new Date();
      midnightToday.setHours(0, 0, 0, 0);

      querySnapshot.docs.forEach((doc) => {
        const data = doc.data();
        const orderDate = data.bookingTime.toDate();

        // Calculate order count and revenue for today
        if (orderDate >= midnightToday) {
          orderCountToday++;
          revenueToday += data.orderValue;
        }
      });

      // Update overview items using functional update
      setOverviewItems((prevItems) =>
        prevItems.map((item) => {
          if (item.title === COMPLETED_BOOKINGS_TEXT) {
            return { ...item, message: orderCountToday };
          } else if (item.title === REVENUE_TODAY_TEXT) {
            return {
              ...item,
              message: `${INDIAN_RUPPEE_SYMBOL} ${revenueToday}`,
            };
          }
          return item;
        })
      );
    };

    const getActiveOrdersSummary = () => {
      const activeTables = liveTables.filter(
        (table) => table.status === "Occupied"
      ).length;
      const activeOrders = liveOrders.filter((order) =>
        ACTIVE_ORDERS.includes(order.status)
      ).length;
      const ordersInKitchen = liveOrders.filter((order) =>
        IN_KITCHEN_ORDERS.includes(order.status)
      ).length;
      const ordersPendingAction = liveOrders.filter((order) =>
        ORDERS_PENDING_ACTION.includes(order.status)
      ).length;

      setOverviewItems((prevItems) =>
        prevItems.map((item) => {
          if (item.title === ACTIVE_TABLES_TEXT) {
            return { ...item, message: activeTables };
          } else if (item.title === ACTIVE_ORDERS_TEXT) {
            return { ...item, message: activeOrders };
          } else if (item.title === IN_KITCHEN_ORDERS_TEXT)
            return { ...item, message: ordersInKitchen };
          else if (item.title === PENDING_ORDERS_TEXT)
            return { ...item, message: ordersPendingAction };
          return item;
        })
      );
    };

    getActiveOrdersSummary();
    getCompletedOrderSummary();

    // Clean up function
    return () => {
      // Any cleanup code if needed
    };
  }, [liveTables, liveOrders]);

  return (
    <ThemedView style={styles.overviewContainer}>
      {overviewItems.map((item, idx) => (
        <ThemedView key={idx} style={styles.overviewItem}>
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
