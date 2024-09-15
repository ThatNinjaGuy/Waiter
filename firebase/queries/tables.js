import {
  collection,
  writeBatch,
  doc,
  deleteDoc,
  updateDoc,
  query,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

const tablesPath = "hotel-details/seating-arrangement/tables/";

export const fetchAllTables = async (setTables, setIsLoading) => {
  try {
    const tablesRef = collection(db, tablesPath);
    const q = query(tablesRef);

    // Set up real-time listener
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const allTables = [];
      querySnapshot.docs.forEach((doc) => {
        allTables.push({ id: doc.id, ...doc.data() });
      });
      setTables(allTables);
      setIsLoading(false);
    });
    // Clean up the listener on component unmount
    return () => unsubscribe();
  } catch (error) {
    console.error("Error fetching tables:", error);
  }
};

export const addTable = async (items, tables, setTables) => {
  const batch = writeBatch(db);
  const newItems = [];

  items.forEach((item) => {
    item.number = item.number ? item.number : tables.length + 1;
    item.searchableKey = item.number;
    item.status = "Available";
    const docRef = doc(collection(db, tablesPath));
    batch.set(docRef, item);
    newItems.push({ ...item, id: docRef.id });
  });

  try {
    await batch.commit();
    setTables([...tables, ...newItems]);
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
    const itemRef = doc(db, tablesPath, id);
    await updateDoc(itemRef, updatedItem);
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
    await deleteDoc(doc(db, tablesPath, id));
    setTables(tables.filter((item) => item.id !== id));
    console.log("Table successfully deleted!");
  } catch (error) {
    console.error("Error removing table: ", error);
  }
};
