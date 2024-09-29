import React, { useState, useEffect, useContext } from "react";
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
import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";
import AuthContext from "@/components/Authentication/AuthProvider";
import AuthScreen from "@/screens/AuthScreen/AuthScreen";
import { isAdminEmployee } from "@/utils/entitlementManagement";

const InventoryScreenContainer = () => {
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [inventoryItems, setInventoryItems] = useState([]);
  const isInventoryItemClickable = isAdminEmployee(user.staffDetails?.role);
  const isAddItemButtonVisible = isAdminEmployee(user.staffDetails?.role);

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
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching inventory items:", error);
      }
    };

    setIsLoading(true);
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

  if (!user) return <AuthScreen />;

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <InventoryScreenView
      inventoryItems={inventoryItems}
      addInventoryItem={addInventoryItem}
      deleteInventoryItem={deleteInventoryItem}
      updateInventoryItem={updateInventoryItem}
      isInventoryItemClickable={isInventoryItemClickable}
      isAddItemButtonVisible={isAddItemButtonVisible}
    />
  );
};

export default InventoryScreenContainer;
