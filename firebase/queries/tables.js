import { Platform } from "react-native";
import { db } from "@/firebase/firebaseConfig";

export const tablesPath = "hotel-details/seating-arrangement/tables";

export const fetchAllTables = async (setTables, setIsLoading) => {
  try {
    let unsubscribe;
    if (Platform.OS === "web") {
      const { collection, query, onSnapshot } = await import(
        "firebase/firestore"
      );
      const tablesRef = collection(db, tablesPath);
      const q = query(tablesRef);
      unsubscribe = onSnapshot(q, (querySnapshot) => {
        const allTables = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        if (setTables) setTables(allTables);
        if (setIsLoading) setIsLoading(false);
      });
    } else {
      const tablesRef = db.collection(tablesPath);
      unsubscribe = tablesRef.onSnapshot((querySnapshot) => {
        const allTables = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        if (setTables) setTables(allTables);
        if (setIsLoading) setIsLoading(false);
      });
    }
    return () => unsubscribe();
  } catch (error) {
    console.error("Error fetching tables:", error);
  }
};

export const addTable = async (items, tables, setTables) => {
  try {
    const newItems = [];
    if (Platform.OS === "web") {
      const { collection, addDoc, writeBatch } = await import(
        "firebase/firestore"
      );
      const batch = writeBatch(db);
      for (const item of items) {
        item.number = item.number ? item.number : tables.length + 1;
        item.searchableKey = item.number;
        item.status = "Available";
        const docRef = await addDoc(collection(db, tablesPath), item);
        newItems.push({ ...item, id: docRef.id });
      }
      await batch.commit();
    } else {
      const batch = db.batch();
      for (const item of items) {
        item.number = item.number ? item.number : tables.length + 1;
        item.searchableKey = item.number;
        item.status = "Available";
        const docRef = db.collection(tablesPath).doc();
        batch.set(docRef, item);
        newItems.push({ ...item, id: docRef.id });
      }
      await batch.commit();
    }
    if (setTables) setTables([...tables, ...newItems]);
    console.log("Add table successful");
  } catch (error) {
    console.error("Error adding table:", error);
  }
};

export const updateTableDetails = async (
  id,
  updatedItem,
  tables,
  setTables
) => {
  try {
    if (Platform.OS === "web") {
      const { doc, updateDoc } = await import("firebase/firestore");
      const itemRef = doc(db, tablesPath, id);
      await updateDoc(itemRef, updatedItem);
    } else {
      await db.collection(tablesPath).doc(id).update(updatedItem);
    }
    if (setTables && tables)
      setTables(
        tables.map((item) =>
          item.id === id ? { ...item, ...updatedItem } : item
        )
      );
    console.log("Table successfully updated!");
  } catch (error) {
    console.error("Error updating table: ", error);
  }
};

export const deleteTableDetails = async (id, tables, setTables) => {
  try {
    if (Platform.OS === "web") {
      const { doc, deleteDoc } = await import("firebase/firestore");
      await deleteDoc(doc(db, tablesPath, id));
    } else {
      await db.collection(tablesPath).doc(id).delete();
    }
    setTables(tables.filter((item) => item.id !== id));
    console.log("Table successfully deleted!");
  } catch (error) {
    console.error("Error removing table: ", error);
  }
};
