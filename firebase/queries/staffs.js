import {
  collection,
  getDocs,
  writeBatch,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

export const staffsPath = "hotel-details/staff-details/staffs";

export const updateStaff = async (id, updatedItem, setStaffs) => {
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
  }
};
