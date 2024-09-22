import {
  collection,
  getDocs,
  writeBatch,
  doc,
  deleteDoc,
  updateDoc,
  query,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

export const staffsPath = "hotel-details/staff-details/staffs";

export const fetchAllStaffs = async (setStaffs, setIsLoading) => {
  try {
    const staffsRef = collection(db, staffsPath);
    const q = query(staffsRef);

    // Set up real-time listener
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const allStaffs = [];
      querySnapshot.docs.forEach((doc) => {
        allStaffs.push({ id: doc.id, ...doc.data() });
      });
      if (setStaffs) setStaffs(allStaffs);
      if (setIsLoading) setIsLoading(false);
    });
    // Clean up the listener on component unmount
    return () => unsubscribe();
  } catch (error) {
    console.error("Error fetching staffs:", error);
  }
};

export const updateStaff = async (id, updatedItem, setStaffs, setLoading) => {
  try {
    const itemRef = doc(db, staffsPath, id);
    await updateDoc(itemRef, updatedItem);
    if (setStaffs)
      setStaffs(
        staffs.map((item) =>
          item.id === id ? { ...item, ...updatedItem } : item
        )
      );
    console.log("Document successfully updated!");
  } catch (error) {
    console.error("Error updating document: ", error);
  } finally {
    if (setLoading) setLoading(false);
  }
};
