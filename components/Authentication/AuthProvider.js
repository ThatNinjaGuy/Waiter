import React, { createContext, useState, useEffect } from "react";
import { onAuthStateChanged, signInWithCustomToken } from "firebase/auth";
import { auth, db } from "@/firebase/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const storeAuthToken = async (user) => {
    try {
      const token = await user.getIdToken();
      if (Platform.OS === "web") {
        localStorage.setItem("authToken", token);
      } else {
        await AsyncStorage.setItem("authToken", token);
      }
    } catch (error) {
      console.error("Error storing auth token:", error);
    }
  };

  const getStoredToken = async () => {
    if (Platform.OS === "web") {
      return localStorage.getItem("authToken");
    } else {
      return await AsyncStorage.getItem("authToken");
    }
  };

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
      const token = await getStoredToken();
      if (token) {
        try {
          await signInWithCustomToken(auth, token);
        } catch (error) {
          console.error("Error signing in with stored token:", error);
          // Clear invalid token
          if (Platform.OS === "web") {
            localStorage.removeItem("authToken");
          } else {
            await AsyncStorage.removeItem("authToken");
          }
        }
      }
      setLoading(false);
    };

    initializeAuth();

    const subscriber = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const updatedUser = await fetchStaffDetails(firebaseUser);
        setUser(updatedUser);
        await storeAuthToken(firebaseUser);
      } else {
        setUser(null);
      }
    });

    return () => subscriber();
  }, []);

  const logout = async () => {
    await auth.signOut();
    if (Platform.OS === "web") {
      localStorage.removeItem("authToken");
    } else {
      await AsyncStorage.removeItem("authToken");
    }
    setUser(null);
  };

  if (loading) {
    return null; // or a loading component
  }

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
