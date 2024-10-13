import { Platform } from "react-native";
import { db } from "@/firebase/firebaseConfig";
import { constructHotelPath } from "./common";

export const fetchHotelData = async (restaurantPath) => {
  try {
    const path = constructHotelPath(restaurantPath);
    let docSnap;

    if (Platform.OS === "web") {
      const { doc, getDoc } = await import("firebase/firestore");
      const docRef = doc(db, path);
      docSnap = await getDoc(docRef);
    } else {
      docSnap = await db.doc(path).get();
    }

    if (
      docSnap.exists ||
      (typeof docSnap.exists === "function" && docSnap.exists())
    ) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        category: data.category,
        city: data.city,
        country: data.country,
        name: data.name,
        owner: data.owner,
        pinCode: data.pinCode,
        state: data.state,
      };
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching hotel data:", error);
    return null;
  }
};

export const updateHotelData = async (restaurantPath, updatedData) => {
  try {
    const path = constructHotelPath(restaurantPath);
    if (Platform.OS === "web") {
      const { doc, updateDoc } = await import("firebase/firestore");
      const docRef = doc(db, path);
      await updateDoc(docRef, updatedData);
    } else {
      await db.doc(path).update(updatedData);
    }
    console.log("Hotel data updated successfully");
  } catch (error) {
    console.error("Error updating hotel data:", error);
    throw error;
  }
};

export const setHotelData = async (restaurantPath, data) => {
  try {
    const path = constructHotelPath(restaurantPath);
    if (Platform.OS === "web") {
      const { doc, setDoc } = await import("firebase/firestore");
      const docRef = doc(db, path);
      await setDoc(docRef, data);
    } else {
      await db.doc(path).set(data);
    }
    console.log("Hotel data set successfully");
  } catch (error) {
    console.error("Error setting hotel data:", error);
    throw error;
  }
};
