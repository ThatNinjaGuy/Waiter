import { Platform } from "react-native";
import { db } from "@/firebase/firebaseConfig";
import { constructHotelPath } from "./common";

export const completedOrderPath = "/completed-orders";

export const addCompletedOrder = async (restaurantPath, order) => {
  const path = constructHotelPath(restaurantPath) + completedOrderPath;
  try {
    if (Platform.OS === "web") {
      const { collection, addDoc } = await import("firebase/firestore");
      const docRef = await addDoc(collection(db, path), order);
    } else {
      const docRef = await db.collection(path).add(order);
    }
    console.log("Completed order addition successful");
  } catch (error) {
    console.error("Error adding completed order:", error);
    throw error;
  }
};

export const fetchCompletedOrders = async (
  restaurantPath,
  setCompletedOrders,
  setIsLoading
) => {
  const path = constructHotelPath(restaurantPath) + completedOrderPath;
  try {
    let querySnapshot;
    if (Platform.OS === "web") {
      const { collection, getDocs } = await import("firebase/firestore");
      querySnapshot = await getDocs(collection(db, path));
    } else {
      querySnapshot = await db.collection(path).get();
    }
    const orders = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    if (setCompletedOrders) setCompletedOrders(orders);
    if (setIsLoading) setIsLoading(false);
  } catch (error) {
    console.error("Error fetching completed orders:", error);
    if (setIsLoading) setIsLoading(false);
  }
};

export const deleteCompletedOrder = async (restaurantPath, orderId) => {
  const path = constructHotelPath(restaurantPath) + completedOrderPath;
  try {
    if (Platform.OS === "web") {
      const { doc, deleteDoc } = await import("firebase/firestore");
      await deleteDoc(doc(db, path, orderId));
    } else {
      await db.collection(path).doc(orderId).delete();
    }
    console.log("Completed order successfully deleted!");
  } catch (error) {
    console.error("Error removing completed order: ", error);
    throw error;
  }
};

export const fetchCompletedOrderSummary = async (restaurantPath, callback) => {
  const path = constructHotelPath(restaurantPath) + completedOrderPath;
  try {
    if (Platform.OS === "web") {
      const { collection, query, onSnapshot } = await import(
        "firebase/firestore"
      );
      const completedOrdersRef = collection(db, path);
      const q = query(completedOrdersRef);
      onSnapshot(q, handleQuerySnapshot);
    } else {
      const completedOrdersRef = db.collection(path);
      completedOrdersRef.onSnapshot(handleQuerySnapshot);
    }

    function handleQuerySnapshot(querySnapshot) {
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

      callback({ orderCountToday, revenueToday });
    }
  } catch (error) {
    console.error("Error fetching completed order summary:", error);
  }
};
