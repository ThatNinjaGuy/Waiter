import React, { useState, useEffect } from "react";
import {
  collection,
  getDoc,
  getDocs,
  writeBatch,
  doc,
  deleteDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import MenuScreenView from "./MenuScreenView";
import { generateUniqueKey } from "@/utils/keyGenerator";

const MenuScreenContainer = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [menuItemCategories, setMenuItemCategories] = useState([]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "menu-items/"));
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMenuItems(items);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };

    const fetchMenuItemCategories = async () => {
      try {
        const docRef = doc(db, "menu-items-categories", "categoriesList"); // Reference to the specific document
        const docSnap = await getDoc(docRef); // Fetch the document

        if (docSnap.exists()) {
          const categories = docSnap.data().categories || []; // Extract categories array
          setMenuItemCategories(categories); // Set the state with the categories
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching menu item categories:", error);
      }
    };

    fetchMenuItems();
    fetchMenuItemCategories();
  }, []);

  const addMenuItemCategory = async (newCategories) => {
    const docRef = doc(db, "menu-items-categories", "categoriesList"); // Use a specific document to store the list

    try {
      // Add new categories to the array
      await updateDoc(docRef, {
        categories: arrayUnion(newCategories),
      });
      console.log("Categories added successfully");
    } catch (error) {
      console.error("Error adding categories:", error);
    }
  };

  // Update an existing category
  const updateCategoryInFirebase = async (oldCategory, newCategory) => {
    const docRef = doc(db, "menu-items-categories", "categoriesList");
    try {
      await updateDoc(docRef, {
        categories: arrayRemove(oldCategory),
      });
      await updateDoc(docRef, {
        categories: arrayUnion(newCategory),
      });
      console.log("Category updated successfully");
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  // Delete a category
  const deleteCategoryFromFirebase = async (category) => {
    const docRef = doc(db, "menu-items-categories", "categoriesList");
    try {
      await updateDoc(docRef, {
        categories: arrayRemove(category),
      });
      console.log("Category deleted successfully");
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

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
    } catch (error) {
      console.error("Error writing batch:", error);
    }
  };

  const addMenuItem = (item) => {
    console.log(item);
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
      categories={menuItemCategories}
      handleUpdateMenuItemCategories={addMenuItemCategory}
    />
  );
};

export default MenuScreenContainer;
