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
import { generateUniqueKey } from "@/utils/keyGenerator";

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

export const updateStaff = async (
  id,
  updatedItem,
  staffs,
  setStaffs,
  setLoading
) => {
  try {
    if (staffs && !updatedItem.searchableKey)
      updatedItem.searchableKey = generateUniqueKey(staffs, updatedItem);
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

export const deleteStaff = async (id) => {
  try {
    await deleteDoc(doc(db, staffsPath, id));
    console.log("Document successfully deleted!");
  } catch (error) {
    console.error("Error removing document: ", error);
  }
};

const addToStaffs = async (
  { name, email, role, age, mobile, authId },
  appDefaultLanguage
) => {
  const batch = writeBatch(db);
  const docRef = doc(collection(db, staffsPath));
  batch.set(docRef, {
    name: name,
    age: age,
    email: email,
    role: role,
    authId: authId,
    mobile: mobile,
    preferredLanguage: appDefaultLanguage,
    notificationSettings: {
      newOrders: true,
      orderReady: true,
      orderCompleted: true,
      newGuests: false,
    },
    createdAt: Date.now(),
  });
  try {
    await batch.commit();
    console.log("Batch write successful");
  } catch (error) {
    console.error("Error writing batch:", error);
  }
};
