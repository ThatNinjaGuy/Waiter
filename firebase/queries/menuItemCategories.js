import { Platform } from "react-native";
import { db } from "@/firebase/firebaseConfig";

const menuItemCategoriesPath = "hotel-details/menu-item-categories";

export const fetchMenuItemCategories = async (
  setMenuItemCategories,
  setIsLoading
) => {
  try {
    let docSnap;
    if (Platform.OS === "web") {
      const { doc, getDoc } = await import("firebase/firestore");
      const docRef = doc(db, menuItemCategoriesPath);
      docSnap = await getDoc(docRef);
    } else {
      docSnap = await db.doc(menuItemCategoriesPath).get();
    }

    if (
      (Platform.OS === "web" && docSnap.exists()) ||
      (Platform.OS !== "web" && docSnap.exists)
    ) {
      const categories = docSnap.data().categories || [];
      setMenuItemCategories(categories);
    } else {
      console.log("Menu item categories document not found");
      setMenuItemCategories([]);
    }
  } catch (error) {
    console.error("Error fetching menu item categories:", error);
    setMenuItemCategories([]);
  } finally {
    if (setIsLoading) setIsLoading(false);
  }
};

export const addMenuItemCategory = async (newCategory) => {
  try {
    if (Platform.OS === "web") {
      const { doc, updateDoc, arrayUnion } = await import("firebase/firestore");
      const docRef = doc(db, menuItemCategoriesPath);
      await updateDoc(docRef, {
        categories: arrayUnion(newCategory),
      });
    } else {
      const docRef = db.doc(menuItemCategoriesPath);
      await docRef.update({
        categories: db.FieldValue.arrayUnion(newCategory),
      });
    }
    console.log("Menu category added successfully");
  } catch (error) {
    console.error("Error adding menu category:", error);
  }
};

export const updateMenuItemCategory = async (oldCategory, newCategory) => {
  try {
    if (Platform.OS === "web") {
      const { doc, updateDoc, arrayRemove, arrayUnion } = await import(
        "firebase/firestore"
      );
      const docRef = doc(db, menuItemCategoriesPath);
      await updateDoc(docRef, {
        categories: arrayRemove(oldCategory),
      });
      await updateDoc(docRef, {
        categories: arrayUnion(newCategory),
      });
    } else {
      const docRef = db.doc(menuItemCategoriesPath);
      await docRef.update({
        categories: db.FieldValue.arrayRemove(oldCategory),
      });
      await docRef.update({
        categories: db.FieldValue.arrayUnion(newCategory),
      });
    }
    console.log("Menu category updated successfully");
  } catch (error) {
    console.error("Error updating menu category:", error);
  }
};

export const deleteMenuItemCategory = async (category) => {
  try {
    if (Platform.OS === "web") {
      const { doc, updateDoc, arrayRemove } = await import(
        "firebase/firestore"
      );
      const docRef = doc(db, menuItemCategoriesPath);
      await updateDoc(docRef, {
        categories: arrayRemove(category),
      });
    } else {
      const docRef = db.doc(menuItemCategoriesPath);
      await docRef.update({
        categories: db.FieldValue.arrayRemove(category),
      });
    }
    console.log("Menu category deleted successfully");
  } catch (error) {
    console.error("Error deleting menu category:", error);
  }
};
