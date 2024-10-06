import { Platform } from "react-native";
import { db } from "@/firebase/firebaseConfig";

export const completedOrderPath = "hotel-details/completed-orders/orders";

export const addCompletedOrder = async (order) => {
  try {
    if (Platform.OS === "web") {
      const { collection, addDoc } = await import("firebase/firestore");
      const docRef = await addDoc(collection(db, completedOrderPath), order);
      console.log("Completed order added with ID: ", docRef.id);
    } else {
      const docRef = await db.collection(completedOrderPath).add(order);
      console.log("Completed order added with ID: ", docRef.id);
    }
    console.log("Completed order addition successful");
  } catch (error) {
    console.error("Error adding completed order:", error);
    throw error;
  }
};

export const fetchCompletedOrders = async (
  setCompletedOrders,
  setIsLoading
) => {
  try {
    let querySnapshot;
    if (Platform.OS === "web") {
      const { collection, getDocs } = await import("firebase/firestore");
      querySnapshot = await getDocs(collection(db, completedOrderPath));
    } else {
      querySnapshot = await db.collection(completedOrderPath).get();
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

export const deleteCompletedOrder = async (orderId) => {
  try {
    if (Platform.OS === "web") {
      const { doc, deleteDoc } = await import("firebase/firestore");
      await deleteDoc(doc(db, completedOrderPath, orderId));
    } else {
      await db.collection(completedOrderPath).doc(orderId).delete();
    }
    console.log("Completed order successfully deleted!");
  } catch (error) {
    console.error("Error removing completed order: ", error);
    throw error;
  }
};
