import { Platform } from "react-native";
import { db } from "@/firebase/firebaseConfig";
import { generateUniqueKey } from "@/utils/keyGenerator";

const menuItemsPath = "hotel-details/menu/menu-items";

export const fetchMenuItems = async (setMenuItems, setIsLoading) => {
  try {
    let querySnapshot;
    if (Platform.OS === "web") {
      const { collection, getDocs } = await import("firebase/firestore");
      querySnapshot = await getDocs(collection(db, menuItemsPath));
    } else {
      querySnapshot = await db.collection(menuItemsPath).get();
    }
    const items = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setMenuItems(items);
  } catch (error) {
    console.error("Error fetching menu items:", error);
  } finally {
    if (setIsLoading) setIsLoading(false);
  }
};

export const addMenuItems = async (items, menuItems, setMenuItems) => {
  const newItems = [];

  try {
    if (Platform.OS === "web") {
      const { collection, addDoc, writeBatch } = await import(
        "firebase/firestore"
      );
      const batch = writeBatch(db);
      for (const item of items) {
        item.searchableKey = generateUniqueKey(menuItems, item);
        const docRef = await addDoc(collection(db, menuItemsPath), item);
        newItems.push({ ...item, id: docRef.id });
      }
      await batch.commit();
    } else {
      const batch = db.batch();
      for (const item of items) {
        item.searchableKey = generateUniqueKey(menuItems, item);
        const docRef = db.collection(menuItemsPath).doc();
        batch.set(docRef, item);
        newItems.push({ ...item, id: docRef.id });
      }
      await batch.commit();
    }
    console.log("Menu items added successfully");
    setMenuItems([...menuItems, ...newItems]);
  } catch (error) {
    console.error("Error adding menu items:", error);
  }
};

export const updateMenuItem = async (
  id,
  updatedItem,
  menuItems,
  setMenuItems
) => {
  try {
    if (Platform.OS === "web") {
      const { doc, updateDoc } = await import("firebase/firestore");
      const itemRef = doc(db, menuItemsPath, id);
      await updateDoc(itemRef, updatedItem);
    } else {
      await db.collection(menuItemsPath).doc(id).update(updatedItem);
    }
    setMenuItems(
      menuItems.map((item) =>
        item.id === id ? { ...item, ...updatedItem } : item
      )
    );
    console.log("Menu Item successfully updated!");
  } catch (error) {
    console.error("Error updating menu item: ", error);
  }
};

export const deleteMenuItem = async (id, menuItems, setMenuItems) => {
  try {
    if (Platform.OS === "web") {
      const { doc, deleteDoc } = await import("firebase/firestore");
      await deleteDoc(doc(db, menuItemsPath, id));
    } else {
      await db.collection(menuItemsPath).doc(id).delete();
    }
    setMenuItems(menuItems.filter((item) => item.id !== id));
    console.log("Menu item successfully deleted!");
  } catch (error) {
    console.error("Error removing menu item: ", error);
  }
};
