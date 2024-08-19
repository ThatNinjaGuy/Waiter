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
import InventoryScreenView from "./InventoryScreenView";
import { generateUniqueKey } from "@/utils/keyGenerator";

const InventoryScreenContainer = () => {
  const [inventoryItems, setInventoryItems] = useState([]);

  useEffect(() => {
    const fetchInventoryItems = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "hotel-details/inventory/inventory-items")
        );
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setInventoryItems(items);
      } catch (error) {
        console.error("Error fetching inventory items:", error);
      }
    };

    fetchInventoryItems();
  }, []);

  const addInventoryItems = async (items) => {
    const batch = writeBatch(db);
    const newItems = [];

    items.forEach((item) => {
      item.searchableKey = generateUniqueKey(inventoryItems, item);
      const docRef = doc(
        collection(db, "hotel-details/inventory/inventory-items")
      );
      batch.set(docRef, item);
      newItems.push({ ...item, id: docRef.id });
    });

    try {
      await batch.commit();
      console.log("Batch write successful");
      setInventoryItems([...inventoryItems, ...newItems]);
    } catch (error) {
      console.error("Error writing batch:", error);
    }
  };

  const addInventoryItem = (item) => {
    addInventoryItems([item]);
  };

  const deleteInventoryItem = async (id) => {
    try {
      await deleteDoc(doc(db, "hotel-details/inventory/inventory-items", id));
      setInventoryItems(inventoryItems.filter((item) => item.id !== id));
      console.log("Document successfully deleted!");
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };

  const updateInventoryItem = async (id, updatedItem) => {
    try {
      const itemRef = doc(db, "hotel-details/inventory/inventory-items", id);
      await updateDoc(itemRef, updatedItem);
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

  return (
    <InventoryScreenView
      inventoryItems={inventoryItems}
      addInventoryItem={addInventoryItem}
      deleteInventoryItem={deleteInventoryItem}
      updateInventoryItem={updateInventoryItem}
    />
  );
};

export default InventoryScreenContainer;
