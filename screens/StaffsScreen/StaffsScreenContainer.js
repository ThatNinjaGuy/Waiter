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
import StaffScreenView from "./StaffScreenView";
import { generateUniqueKey } from "@/utils/keyGenerator";

const StaffsScreenContainer = () => {
  const [staffs, setStaffs] = useState([]);

  useEffect(() => {
    const fetchStaffs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "staffs/"));
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStaffs(items);
        console.log("Fetched staffs:", items);
      } catch (error) {
        console.error("Error fetching staffs:", error);
      }
    };

    fetchStaffs();
  }, []);

  const addStaffs = async (items) => {
    const batch = writeBatch(db);
    const newItems = [];

    items.forEach((item) => {
      item.searchableKey = generateUniqueKey(staffs, item);
      const docRef = doc(collection(db, "staffs/"));
      batch.set(docRef, item);
      newItems.push({ ...item, id: docRef.id });
    });

    try {
      await batch.commit();
      console.log("Batch write successful");
      setStaffs([...staffs, ...newItems]);
      console.log(newItems);
    } catch (error) {
      console.error("Error writing batch:", error);
    }
  };

  const addStaff = (item) => {
    addStaffs([item]);
  };

  const deleteStaff = async (id) => {
    try {
      await deleteDoc(doc(db, "staffs/", id));
      setStaffs(staffs.filter((item) => item.id !== id));
      console.log("Document successfully deleted!");
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };

  const updateStaff = async (id, updatedItem) => {
    try {
      const itemRef = doc(db, "staffs/", id);
      await updateDoc(itemRef, updatedItem);
      setStaffs(
        staffs.map((item) =>
          item.id === id ? { ...item, ...updatedItem } : item
        )
      );
      console.log("Document successfully updated!");
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  return (
    <StaffScreenView
      staffs={staffs}
      addStaff={addStaff}
      deleteStaff={deleteStaff}
      updateStaff={updateStaff}
    />
  );
};

export default StaffsScreenContainer;
