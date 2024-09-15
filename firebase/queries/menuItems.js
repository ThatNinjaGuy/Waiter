import {
  collection,
  getDocs,
  writeBatch,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { generateUniqueKey } from "@/utils/keyGenerator";

const menuItemsPath = "hotel-details/menu/menu-items";

export const fetchMenuItems = async (setMenuItems, setIsLoading) => {
  try {
    const querySnapshot = await getDocs(collection(db, menuItemsPath));
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
  const batch = writeBatch(db);
  const newItems = [];

  items.forEach((item) => {
    item.searchableKey = generateUniqueKey(menuItems, item);
    const docRef = doc(collection(db, menuItemsPath));
    batch.set(docRef, item);
    newItems.push({ ...item, id: docRef.id });
  });

  try {
    await batch.commit();
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
    const itemRef = doc(db, menuItemsPath, id);
    await updateDoc(itemRef, updatedItem);
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
    await deleteDoc(doc(db, menuItemsPath, id));
    setMenuItems(menuItems.filter((item) => item.id !== id));
    console.log("Menu item successfully deleted!");
  } catch (error) {
    console.error("Error removing menu item: ", error);
  }
};
