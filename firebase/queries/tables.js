import { Platform } from "react-native";
import { db } from "@/firebase/firebaseConfig";
import { constructHotelPath } from "./common";

export const tablesPath = "/tables";

export const fetchAllTables = async (
  restaurantPath,
  setTables,
  setIsLoading
) => {
  try {
    const path = constructHotelPath(restaurantPath) + tablesPath;
    let unsubscribe;
    if (Platform.OS === "web") {
      const { collection, query, onSnapshot } = await import(
        "firebase/firestore"
      );
      const tablesRef = collection(db, path);
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
      const tablesRef = db.collection(path);
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

export const addTable = async (restaurantPath, items, tables, setTables) => {
  const path = constructHotelPath(restaurantPath) + tablesPath;
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
        const docRef = await addDoc(collection(db, path), item);
        newItems.push({ ...item, id: docRef.id });
      }
      await batch.commit();
    } else {
      const batch = db.batch();
      for (const item of items) {
        item.number = item.number ? item.number : tables.length + 1;
        item.searchableKey = item.number;
        item.status = "Available";
        const docRef = db.collection(path).doc();
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
  restaurantPath,
  id,
  updatedItem,
  tables,
  setTables
) => {
  try {
    const path = constructHotelPath(restaurantPath) + tablesPath;
    if (Platform.OS === "web") {
      const { doc, updateDoc } = await import("firebase/firestore");
      const itemRef = doc(db, path, id);
      await updateDoc(itemRef, updatedItem);
    } else {
      await db.collection(path).doc(id).update(updatedItem);
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

export const deleteTableDetails = async (
  restaurantPath,
  id,
  tables,
  setTables
) => {
  try {
    const path = constructHotelPath(restaurantPath) + tablesPath;
    if (Platform.OS === "web") {
      const { doc, deleteDoc } = await import("firebase/firestore");
      await deleteDoc(doc(db, path, id));
    } else {
      await db.collection(path).doc(id).delete();
    }
    setTables(tables.filter((item) => item.id !== id));
    console.log("Table successfully deleted!");
  } catch (error) {
    console.error("Error removing table: ", error);
  }
};

export const updateOrderStatus = async (
  restaurantPath,
  orderId,
  tableId,
  orderStatus
) => {
  try {
    const path = constructHotelPath(restaurantPath) + tablesPath;
    let tableDocRef, updateDocFunc, getDocFunc;

    if (Platform.OS === "web") {
      const { doc, updateDoc, getDoc } = await import("firebase/firestore");
      tableDocRef = doc(db, path, tableId);
      updateDocFunc = updateDoc;
      getDocFunc = getDoc;
    } else {
      tableDocRef = db.collection(path).doc(tableId);
      updateDocFunc = (ref, data) => ref.update(data);
      getDocFunc = (ref) => ref.get();
    }

    // Get the current orders
    const tableSnapshot = await getDocFunc(tableDocRef);
    const tableData =
      Platform.OS === "web" ? tableSnapshot.data() : tableSnapshot.data();
    const currentOrders = tableData.orders || [];

    // Find the order to update
    const updatedOrders = currentOrders.map((order) =>
      order.id === orderId ? { ...order, status: orderStatus } : order
    );

    // Determine the new table status
    const newTableStatus = updatedOrders.some(
      (order) => order.status !== "Completed"
    )
      ? "Occupied"
      : "Available";

    // Update the orders array and table status in Firestore
    await updateDocFunc(tableDocRef, {
      orders: updatedOrders,
      status: newTableStatus,
    });

    console.log("Order status and table status updated successfully");
  } catch (error) {
    console.error("Error updating order status:", error);
  }
};
