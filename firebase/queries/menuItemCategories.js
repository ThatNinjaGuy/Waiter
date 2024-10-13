import { Platform } from "react-native";
import { db } from "@/firebase/firebaseConfig";
import { constructHotelPath } from "./common";

export const fetchMenuItemCategories = async (
  restaurantPath,
  setMenuItemCategories,
  setIsLoading
) => {
  const path = constructHotelPath(restaurantPath);
  try {
    let docSnap;
    if (Platform.OS === "web") {
      const { doc, getDoc } = await import("firebase/firestore");
      const docRef = doc(db, path);
      docSnap = await getDoc(docRef);
    } else {
      docSnap = await db.doc(path).get();
    }

    if (
      (Platform.OS === "web" && docSnap.exists()) ||
      (Platform.OS !== "web" && docSnap.exists)
    ) {
      const data = docSnap.data();
      const categories = data["menu-item-categories"] || [];
      setMenuItemCategories(categories);
    } else {
      console.log("Restaurant document not found");
      setMenuItemCategories([]);
    }
  } catch (error) {
    console.error("Error fetching menu item categories:", error);
    setMenuItemCategories([]);
  } finally {
    if (setIsLoading) setIsLoading(false);
  }
};

export const addMenuItemCategory = async (restaurantPath, newCategory) => {
  const path = constructHotelPath(restaurantPath);
  try {
    if (Platform.OS === "web") {
      const { doc, updateDoc, arrayUnion } = await import("firebase/firestore");
      const docRef = doc(db, path);
      await updateDoc(docRef, {
        "menu-item-categories": arrayUnion(newCategory),
      });
    } else {
      const docRef = db.doc(path);
      await docRef.update({
        "menu-item-categories": db.FieldValue.arrayUnion(newCategory),
      });
    }
    console.log("Menu category added successfully");
  } catch (error) {
    console.error("Error adding menu category:", error);
  }
};

export const updateMenuItemCategory = async (
  restaurantPath,
  oldCategory,
  newCategory
) => {
  const path = constructHotelPath(restaurantPath);
  try {
    if (Platform.OS === "web") {
      const { doc, updateDoc, arrayRemove, arrayUnion } = await import(
        "firebase/firestore"
      );
      const docRef = doc(db, path);
      await updateDoc(docRef, {
        "menu-item-categories": arrayRemove(oldCategory),
      });
      await updateDoc(docRef, {
        "menu-item-categories": arrayUnion(newCategory),
      });
    } else {
      const docRef = db.doc(path);
      await docRef.update({
        "menu-item-categories": db.FieldValue.arrayRemove(oldCategory),
      });
      await docRef.update({
        "menu-item-categories": db.FieldValue.arrayUnion(newCategory),
      });
    }
    console.log("Menu category updated successfully");
  } catch (error) {
    console.error("Error updating menu category:", error);
  }
};

export const deleteMenuItemCategory = async (restaurantPath, category) => {
  const path = constructHotelPath(restaurantPath);
  try {
    if (Platform.OS === "web") {
      const { doc, updateDoc, arrayRemove } = await import(
        "firebase/firestore"
      );
      const docRef = doc(db, path);
      await updateDoc(docRef, {
        "menu-item-categories": arrayRemove(category),
      });
    } else {
      const docRef = db.doc(path);
      await docRef.update({
        "menu-item-categories": db.FieldValue.arrayRemove(category),
      });
    }
    console.log("Menu category deleted successfully");
  } catch (error) {
    console.error("Error deleting menu category:", error);
  }
};
