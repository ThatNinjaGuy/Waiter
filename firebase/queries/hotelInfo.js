import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

export const fetchHotelData = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "hotel-details"));
    const hotelDetails = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return hotelDetails;
  } catch (error) {
    console.error("Error fetching hotel data:", error);
  }
};
