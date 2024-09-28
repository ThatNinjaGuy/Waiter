import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

export const fetchHotelData = async () => {
  try {
    const docRef = doc(db, "hotel-details/details");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching hotel data:", error);
    return null;
  }
};
