import { collection, writeBatch, doc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

const completedOrderPath = "hotel-details/completed-orders/orders/";

export const addCompletedOrder = async (order) => {
  const batch = writeBatch(db);
  const docRef = doc(collection(db, completedOrderPath));
  batch.set(docRef, order);
  try {
    await batch.commit();
    console.log("Completed order addition successful");
  } catch (error) {
    console.error("Error adding completed order:", error);
  }
};
