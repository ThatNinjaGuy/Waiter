import {
  getDoc,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

const menuItemCategoriesPath = "hotel-details/menu-item-categories";

export const fetchMenuItemCategories = async (
  setMenuItemCategories,
  setIsLoading
) => {
  try {
    const docRef = doc(db, menuItemCategoriesPath); // Reference to the specific document
    const docSnap = await getDoc(docRef); // Fetch the document

    if (docSnap.exists()) {
      const categories = docSnap.data().categories || []; // Extract categories array
      setMenuItemCategories(categories); // Set the state with the categories
    } else {
      console.error("Menu item categories could not be found");
    }
  } catch (error) {
    console.error("Error fetching menu item categories:", error);
  } finally {
    if (setIsLoading) setIsLoading(false);
  }
};

export const addMenuItemCategory = async (newCategories) => {
  const docRef = doc(db, menuItemCategoriesPath); // Use a specific document to store the list

  try {
    // Add new categories to the array
    await updateDoc(docRef, {
      categories: arrayUnion(newCategories),
    });
    console.log("Menu category added successfully");
  } catch (error) {
    console.error("Error adding menu category:", error);
  }
};

export const updateMenuItemCategory = async (oldCategory, newCategory) => {
  const docRef = doc(db, menuItemCategoriesPath);
  try {
    await updateDoc(docRef, {
      categories: arrayRemove(oldCategory),
    });
    await updateDoc(docRef, {
      categories: arrayUnion(newCategory),
    });
    console.log("Menu category updated successfully");
  } catch (error) {
    console.error("Error updating menu category:", error);
  }
};

export const deleteMenuItemCategory = async (category) => {
  const docRef = doc(db, menuItemCategoriesPath);
  try {
    await updateDoc(docRef, {
      categories: arrayRemove(category),
    });
    console.log("Menu category deleted successfully");
  } catch (error) {
    console.error("Error deleting menu category:", error);
  }
};
