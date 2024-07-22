import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

export const fetchHotelData = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "test-hotel"));
    const hotels = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching hotel data:", error);
  }
};
