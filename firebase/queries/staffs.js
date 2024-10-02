import { Platform } from "react-native";
import { db } from "@/firebase/firebaseConfig";
import { generateUniqueKey } from "@/utils/keyGenerator";

export const staffsPath = "hotel-details/staff-details/staffs";

export const fetchAllStaffs = async (setStaffs, setIsLoading) => {
  try {
    let unsubscribe;
    if (Platform.OS === "web") {
      const { collection, query, onSnapshot } = await import(
        "firebase/firestore"
      );
      const staffsRef = collection(db, staffsPath);
      const q = query(staffsRef);
      unsubscribe = onSnapshot(q, (querySnapshot) => {
        const allStaffs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        if (setStaffs) setStaffs(allStaffs);
        if (setIsLoading) setIsLoading(false);
      });
    } else {
      const staffsRef = db.collection(staffsPath);
      unsubscribe = staffsRef.onSnapshot((querySnapshot) => {
        const allStaffs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        if (setStaffs) setStaffs(allStaffs);
        if (setIsLoading) setIsLoading(false);
      });
    }
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

    if (Platform.OS === "web") {
      const { doc, updateDoc } = await import("firebase/firestore");
      const itemRef = doc(db, staffsPath, id);
      await updateDoc(itemRef, updatedItem);
    } else {
      await db.collection(staffsPath).doc(id).update(updatedItem);
    }

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
    if (Platform.OS === "web") {
      const { doc, deleteDoc } = await import("firebase/firestore");
      await deleteDoc(doc(db, staffsPath, id));
    } else {
      await db.collection(staffsPath).doc(id).delete();
    }
    console.log("Document successfully deleted!");
  } catch (error) {
    console.error("Error removing document: ", error);
  }
};

export const addToStaffs = async (
  { name, email, role, age, mobile, authId },
  appDefaultLanguage
) => {
  const newStaff = {
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
  };

  try {
    if (Platform.OS === "web") {
      const { collection, addDoc } = await import("firebase/firestore");
      await addDoc(collection(db, staffsPath), newStaff);
    } else {
      await db.collection(staffsPath).add(newStaff);
    }
    console.log("Staff added successfully");
  } catch (error) {
    console.error("Error adding staff:", error);
  }
};
