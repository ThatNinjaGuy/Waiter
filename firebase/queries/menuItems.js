import { Platform } from "react-native";
import { db } from "@/firebase/firebaseConfig";
import { generateUniqueKey } from "@/utils/keyGenerator";

const menuItemsPath = "hotel-details/menu/menu-items";

export const fetchMenuItems = async (setMenuItems, setIsLoading) => {
  try {
    let unsubscribe;
    if (Platform.OS === "web") {
      const { collection, onSnapshot } = await import("firebase/firestore");
      const menuItemsRef = collection(db, menuItemsPath);
      unsubscribe = onSnapshot(menuItemsRef, (querySnapshot) => {
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMenuItems(items);
        if (setIsLoading) setIsLoading(false);
      });
    } else {
      const menuItemsRef = db.collection(menuItemsPath);
      unsubscribe = menuItemsRef.onSnapshot((querySnapshot) => {
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMenuItems(items);
        if (setIsLoading) setIsLoading(false);
      });
    }
    return () => unsubscribe();
  } catch (error) {
    console.error("Error fetching menu items:", error);
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
      const menuItemsRef = collection(db, menuItemsPath);
      for (const item of items) {
        item.searchableKey = generateUniqueKey(menuItems, item);
        const docRef = await addDoc(menuItemsRef, item);
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
      const itemRef = doc(db, menuItemsPath, id);
      await deleteDoc(itemRef);
    } else {
      await db.collection(menuItemsPath).doc(id).delete();
    }
    setMenuItems(menuItems.filter((item) => item.id !== id));
    console.log("Menu item successfully deleted!");
  } catch (error) {
    console.error("Error removing menu item: ", error);
  }
};
