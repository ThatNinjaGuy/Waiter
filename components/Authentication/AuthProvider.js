import React, { createContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const staffsRef = collection(
            db,
            "hotel-details/staff-details/staffs"
          );
          const q = query(staffsRef, where("authId", "==", user.uid));
          const querySnapshot = await getDocs(q);

          const staffs = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          if (staffs.length > 0) {
            const updatedUser = {
              ...user,
              staffDetails: staffs[0],
            };
            setUser(updatedUser);
          } else {
            setUser(user);
          }
        } catch (error) {
          setUser(user);
        }
      } else {
        setUser(user);
      }
    });

    return () => subscriber();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
