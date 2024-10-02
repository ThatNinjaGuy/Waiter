import { Platform } from "react-native";
import { db } from "@/firebase/firebaseConfig";

const hotelDetailsPath = "hotel-details/details";

export const fetchHotelData = async () => {
  try {
    let docSnap;
    if (Platform.OS === "web") {
      const { doc, getDoc } = await import("firebase/firestore");
      const docRef = doc(db, hotelDetailsPath);
      docSnap = await getDoc(docRef);
    } else {
      docSnap = await db.doc(hotelDetailsPath).get();
    }

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

export const updateHotelData = async (updatedData) => {
  try {
    if (Platform.OS === "web") {
      const { doc, updateDoc } = await import("firebase/firestore");
      const docRef = doc(db, hotelDetailsPath);
      await updateDoc(docRef, updatedData);
    } else {
      await db.doc(hotelDetailsPath).update(updatedData);
    }
    console.log("Hotel data updated successfully");
  } catch (error) {
    console.error("Error updating hotel data:", error);
    throw error;
  }
};

export const setHotelData = async (data) => {
  try {
    if (Platform.OS === "web") {
      const { doc, setDoc } = await import("firebase/firestore");
      const docRef = doc(db, hotelDetailsPath);
      await setDoc(docRef, data);
    } else {
      await db.doc(hotelDetailsPath).set(data);
    }
    console.log("Hotel data set successfully");
  } catch (error) {
    console.error("Error setting hotel data:", error);
    throw error;
  }
};
