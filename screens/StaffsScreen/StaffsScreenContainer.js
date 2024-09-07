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
import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";

const StaffsScreenContainer = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [staffs, setStaffs] = useState([]);

  useEffect(() => {
    const fetchStaffs = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "hotel-details/staff-details/staffs")
        );
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStaffs(items);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching staffs:", error);
      }
    };

    setIsLoading(true);
    fetchStaffs();
  }, []);

  const addStaffs = async (items) => {
    const batch = writeBatch(db);
    const newItems = [];

    items.forEach((item) => {
      item.searchableKey = generateUniqueKey(staffs, item);
      const docRef = doc(collection(db, "hotel-details/staff-details/staffs"));
      batch.set(docRef, item);
      newItems.push({ ...item, id: docRef.id });
    });

    try {
      await batch.commit();
      console.log("Batch write successful");
      setStaffs([...staffs, ...newItems]);
    } catch (error) {
      console.error("Error writing batch:", error);
    }
  };

  const addStaff = (item) => {
    addStaffs([item]);
  };

  const deleteStaff = async (id) => {
    try {
      await deleteDoc(doc(db, "hotel-details/staff-details/staffs", id));
      setStaffs(staffs.filter((item) => item.id !== id));
      console.log("Document successfully deleted!");
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };

  const updateStaff = async (id, updatedItem) => {
    try {
      const itemRef = doc(db, "hotel-details/staff-details/staffs", id);
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

  if (isLoading) {
    return <LoadingScreen />;
  }

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
