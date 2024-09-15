import React, { useState, useEffect, useContext } from "react";
import {
  collection,
  getDoc,
  getDocs,
  writeBatch,
  doc,
  deleteDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import MenuScreenView from "./MenuScreenView";
import { generateUniqueKey } from "@/utils/keyGenerator";
import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";
import AuthScreen from "@/components/Authentication/AuthScreen";
import AuthContext from "@/components/Authentication/AuthProvider";
import UnauthorizedScreen from "@/components/Authentication/UnauthorizedScreen";

const MenuScreenContainer = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [menuItems, setMenuItems] = useState([]);
  const [menuItemCategories, setMenuItemCategories] = useState([]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "hotel-details/menu/menu-items")
        );
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
        const docRef = doc(db, "hotel-details", "menu-item-categories"); // Reference to the specific document
        const docSnap = await getDoc(docRef); // Fetch the document

        if (docSnap.exists()) {
          const categories = docSnap.data().categories || []; // Extract categories array
          setMenuItemCategories(categories); // Set the state with the categories
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching menu item categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    setIsLoading(true);
    fetchMenuItems();
    fetchMenuItemCategories();
  }, []);

  const addMenuItemCategory = async (newCategories) => {
    const docRef = doc(db, "hotel-details", "menu-item-categories"); // Use a specific document to store the list

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

  const updateMenuItemCategory = async (oldCategory, newCategory) => {
    const docRef = doc(db, "hotel-details", "menu-item-categories");
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

  const deleteMenuItemCategory = async (category) => {
    const docRef = doc(db, "hotel-details", "menu-item-categories");
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
      const docRef = doc(collection(db, "hotel-details/menu/menu-items"));
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
    addMenuItems([item]);
  };

  const deleteMenuItem = async (id) => {
    try {
      await deleteDoc(doc(db, "hotel-details/menu/menu-items", id));
      setMenuItems(menuItems.filter((item) => item.id !== id));
      console.log("Document successfully deleted!");
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };

  const updateMenuItem = async (id, updatedItem) => {
    try {
      const itemRef = doc(db, "hotel-details/menu/menu-items", id);
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

  const { user } = useContext(AuthContext);
  if (!user) return <AuthScreen />;

  if (
    user.staffDetails &&
    !(
      user.staffDetails.role === "Manager" ||
      user.staffDetails.role === "Owner" ||
      !user.staffDetails.role ||
      user.staffDetails.role === ""
    )
  ) {
    return <UnauthorizedScreen />;
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <MenuScreenView
      menuItems={menuItems}
      addMenuItem={addMenuItem}
      deleteMenuItem={deleteMenuItem}
      updateMenuItem={updateMenuItem}
      categories={menuItemCategories}
      setCategories={setMenuItemCategories}
      handleAddMenuItemCategory={addMenuItemCategory}
      handleUpdateMenuItemCategory={updateMenuItemCategory}
      handleDeleteMenuItemCategory={deleteMenuItemCategory}
    />
  );
};

export default MenuScreenContainer;
