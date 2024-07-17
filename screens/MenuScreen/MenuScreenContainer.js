import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  writeBatch,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import MenuScreenView from "./MenuScreenView";
import { generateUniqueKey } from "@/utils/keyGenerator";

const MenuScreenContainer = () => {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "menu-items/"));
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMenuItems(items);
        console.log("Fetched menu items:", items);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };

    fetchMenuItems();
  }, []);

  const addMenuItems = async (items) => {
    const batch = writeBatch(db);
    const newItems = [];

    items.forEach((item) => {
      item.searchableKey = generateUniqueKey(menuItems, item);
      const docRef = doc(collection(db, "menu-items/"));
      batch.set(docRef, item);
      newItems.push({ ...item, id: docRef.id });
    });

    try {
      await batch.commit();
      console.log("Batch write successful");
      setMenuItems([...menuItems, ...newItems]);
      console.log(newItems);
    } catch (error) {
      console.error("Error writing batch:", error);
    }
  };

  const addMenuItem = (item) => {
    addMenuItems([item]);
  };

  const deleteMenuItem = async (id) => {
    try {
      await deleteDoc(doc(db, "menu-items/", id));
      setMenuItems(menuItems.filter((item) => item.id !== id));
      console.log("Document successfully deleted!");
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };

  const updateMenuItem = async (id, updatedItem) => {
    try {
      const itemRef = doc(db, "menu-items/", id);
      await updateDoc(itemRef, updatedItem);
      setMenuItems(
        menuItems.map((item) =>
          item.id === id ? { ...item, ...updatedItem } : item
        )
      );
      console.log("Document successfully updated!");
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  return (
    <MenuScreenView
      menuItems={menuItems}
      addMenuItem={addMenuItem}
      deleteMenuItem={deleteMenuItem}
      updateMenuItem={updateMenuItem}
    />
  );
};

export default MenuScreenContainer;
