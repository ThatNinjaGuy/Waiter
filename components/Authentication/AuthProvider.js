import React, { createContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/firebase/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import { fetchAllTables } from "@/firebase/queries/tables";
import {
  extractOrdersFromTable,
  identifyChangedOrders,
} from "@/utils/orderManagement";
import { sendNotificationToUser } from "@/components/Notifications/Notification";
import { appDefaultLanguage } from "@/constants/appText/common";
import {
  getNotificationTitleTranslation,
  getNotificationContentTranslation,
} from "@/utils/appText/notifications";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [liveOrders, setLiveOrders] = useState();
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

  const publishNotifications = (updated) => {
    if (!updated) return;

    updated.forEach((element) => {
      const title = getNotificationTitleTranslation(user.preferredLanguage);
      const content = getNotificationContentTranslation(
        user.preferredLanguage,
        element
      );
      sendNotificationToUser(title, content);
    });
  };

  useEffect(() => {
    const newOrders = extractOrdersFromTable(liveTables);
    const { updated } = identifyChangedOrders(liveOrders, newOrders);
    publishNotifications(updated);

    setLiveOrders(newOrders);
  }, [liveTables]);

  useEffect(() => {
    const initializeAuth = async () => {
      const subscriber = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          let updatedUser = await fetchStaffDetails(firebaseUser);
          updatedUser.preferredLanguage =
            updatedUser?.staffDetails?.languagePreference || appDefaultLanguage;

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
    <AuthContext.Provider value={{ user, logout, liveTables, liveOrders }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
