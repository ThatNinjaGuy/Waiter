import React, { createContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/firebase/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import { fetchAllTables } from "@/firebase/queries/tables";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [liveTables, setLiveTables] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStaffDetails = async (user) => {
    try {
      const staffsRef = collection(db, "hotel-details/staff-details/staffs");
      const q = query(staffsRef, where("authId", "==", user.uid));
      const querySnapshot = await getDocs(q);

      const staffs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (staffs.length > 0) {
        return {
          ...user,
          staffDetails: staffs[0],
        };
      }
      return user;
    } catch (error) {
      console.error("Error fetching staff details:", error);
      return user;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const subscriber = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const updatedUser = await fetchStaffDetails(firebaseUser);
          await fetchAllTables(setLiveTables, undefined);
          setUser(updatedUser);
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return () => subscriber();
    };

    initializeAuth();
  }, []);

  const logout = async () => {
    await auth.signOut();
    setUser(null);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <AuthContext.Provider value={{ user, logout, liveTables }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
