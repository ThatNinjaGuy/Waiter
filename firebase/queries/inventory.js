import { Platform } from "react-native";
import { db } from "@/firebase/firebaseConfig";
import { constructHotelPath } from "./common";

export const inventoryPath = "/inventory";

export const fetchInventoryItems = async (
  restaurantPath,
  setInventoryItems,
  setIsLoading
) => {
  const path = constructHotelPath(restaurantPath) + inventoryPath;
  try {
    let querySnapshot;
    if (Platform.OS === "web") {
      const { collection, getDocs } = await import("firebase/firestore");
      querySnapshot = await getDocs(collection(db, path));
    } else {
      querySnapshot = await db.collection(path).get();
    }
    const items = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setInventoryItems(items);
    if (setIsLoading) setIsLoading(false);
  } catch (error) {
    console.error("Error fetching inventory items:", error);
    if (setIsLoading) setIsLoading(false);
  }
};

export const addInventoryItems = async (
  restaurantPath,
  items,
  inventoryItems,
  setInventoryItems
) => {
  const path = constructHotelPath(restaurantPath) + inventoryPath;
  try {
    const newItems = [];
    if (Platform.OS === "web") {
      const { collection, addDoc, writeBatch } = await import(
        "firebase/firestore"
      );
      const batch = writeBatch(db);
      for (const item of items) {
        const docRef = await addDoc(collection(db, path), item);
        newItems.push({ ...item, id: docRef.id });
      }
      await batch.commit();
    } else {
      const batch = db.batch();
      for (const item of items) {
        const docRef = db.collection(path).doc();
        batch.set(docRef, item);
        newItems.push({ ...item, id: docRef.id });
      }
      await batch.commit();
    }
    setInventoryItems([...inventoryItems, ...newItems]);
    console.log("Batch write successful");
  } catch (error) {
    console.error("Error writing batch:", error);
  }
};

export const deleteInventoryItem = async (
  restaurantPath,
  id,
  inventoryItems,
  setInventoryItems
) => {
  const path = constructHotelPath(restaurantPath) + inventoryPath;
  try {
    if (Platform.OS === "web") {
      const { doc, deleteDoc } = await import("firebase/firestore");
      await deleteDoc(doc(db, path, id));
    } else {
      await db.collection(path).doc(id).delete();
    }
    setInventoryItems(inventoryItems.filter((item) => item.id !== id));
    console.log("Document successfully deleted!");
  } catch (error) {
    console.error("Error removing document: ", error);
  }
};

export const updateInventoryItem = async (
  restaurantPath,
  id,
  updatedItem,
  inventoryItems,
  setInventoryItems
) => {
  const path = constructHotelPath(restaurantPath) + inventoryPath;
  try {
    if (Platform.OS === "web") {
      const { doc, updateDoc } = await import("firebase/firestore");
      const itemRef = doc(db, path, id);
      await updateDoc(itemRef, updatedItem);
    } else {
      await db.collection(path).doc(id).update(updatedItem);
    }
    setInventoryItems(
      inventoryItems.map((item) =>
        item.id === id ? { ...item, ...updatedItem } : item
      )
    );
    console.log("Document successfully updated!");
  } catch (error) {
    console.error("Error updating document: ", error);
  }
};
