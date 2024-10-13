import { Platform } from "react-native";
import { db } from "@/firebase/firebaseConfig";
import { generateUniqueKey } from "@/utils/keyGenerator";
import { DEFAULT_NOTIFICATION_SETTINGS } from "@/constants/notificationControls";
import { constructHotelPath } from "./common";

export const staffsPath = "/staffs";
export const signUpRequestsPath = "/signup-requests";

export const fetchAllSignupRequests = async (
  restaurantPath,
  setRequests,
  setLoading
) => {
  const path = constructHotelPath(restaurantPath) + signUpRequestsPath;
  try {
    let unsubscribe;
    if (Platform.OS === "web") {
      const { collection, query, onSnapshot } = await import(
        "firebase/firestore"
      );
      const signUpRequestsRef = collection(db, path);
      const q = query(signUpRequestsRef);
      unsubscribe = onSnapshot(q, (querySnapshot) => {
        const allRequests = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        if (setRequests) setRequests(allRequests);
        if (setLoading) setLoading(false);
      });
    } else {
      const signUpRequestsRef = db.collection(path);
      unsubscribe = signUpRequestsRef.onSnapshot((querySnapshot) => {
        const allRequests = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        if (setRequests) setRequests(allRequests);
        if (setLoading) setLoading(false);
      });
    }
    return () => unsubscribe();
  } catch (error) {
    console.error("Error fetching user sign up requests:", error);
  }
};

export const addSignUpRequest = async (restaurantPath, userData) => {
  const path = constructHotelPath(restaurantPath) + signUpRequestsPath;
  try {
    if (Platform.OS === "web") {
      const { collection, addDoc } = await import("firebase/firestore");
      await addDoc(collection(db, path), userData);
    } else {
      await db.collection(path).add(userData);
    }
    console.log("Sign-up request added successfully");
    return true;
  } catch (error) {
    console.error("Error adding sign-up request:", error);
    return false;
  }
};

export const deleteSignupRequest = async (restaurantPath, id) => {
  const path = constructHotelPath(restaurantPath) + signUpRequestsPath;
  try {
    if (Platform.OS === "web") {
      const { doc, deleteDoc } = await import("firebase/firestore");
      const requestRef = doc(db, path, id);
      await deleteDoc(requestRef);
    } else {
      await db.collection(path).doc(id).delete();
    }
    console.log("Signup request successfully deleted!");
  } catch (error) {
    console.error("Error deleting signup request: ", error);
  }
};

export const fetchAllStaffs = async (
  restaurantPath,
  setStaffs,
  setIsLoading
) => {
  try {
    const path = constructHotelPath(restaurantPath) + staffsPath;
    let unsubscribe;
    if (Platform.OS === "web") {
      const { collection, query, onSnapshot } = await import(
        "firebase/firestore"
      );
      const staffsRef = collection(db, path);
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
      const staffsRef = db.collection(path);
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
  restaurantPath,
  id,
  updatedItem,
  staffs,
  setStaffs,
  setLoading
) => {
  try {
    const path = constructHotelPath(restaurantPath) + staffsPath;
    if (staffs && !updatedItem.searchableKey)
      updatedItem.searchableKey = generateUniqueKey(staffs, updatedItem);

    if (Platform.OS === "web") {
      const { doc, updateDoc } = await import("firebase/firestore");
      const itemRef = doc(db, path, id);
      await updateDoc(itemRef, updatedItem);
    } else {
      await db.collection(path).doc(id).update(updatedItem);
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

export const deleteStaff = async (restaurantPath, id) => {
  const path = constructHotelPath(restaurantPath) + staffsPath;
  try {
    if (Platform.OS === "web") {
      const { doc, deleteDoc } = await import("firebase/firestore");
      await deleteDoc(doc(db, path, id));
    } else {
      await db.collection(path).doc(id).delete();
    }
    console.log("Document successfully deleted!");
  } catch (error) {
    console.error("Error removing document: ", error);
  }
};

export const addToStaffs = async (
  restaurantPath,
  { name, email, role, age, mobile, authId },
  appDefaultLanguage
) => {
  const path = constructHotelPath(restaurantPath) + staffsPath;
  const newStaff = {
    name: name,
    age: age,
    email: email,
    role: role,
    authId: authId,
    mobile: mobile,
    preferredLanguage: appDefaultLanguage,
    notificationSettings: DEFAULT_NOTIFICATION_SETTINGS,
    createdAt: Date.now(),
  };

  try {
    if (Platform.OS === "web") {
      const { collection, addDoc } = await import("firebase/firestore");
      await addDoc(collection(db, path), newStaff);
    } else {
      await db.collection(path).add(newStaff);
    }
    console.log("Staff added successfully");
  } catch (error) {
    console.error("Error adding staff:", error);
  }
};
