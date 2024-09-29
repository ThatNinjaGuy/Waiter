import { Platform } from "react-native";
import React, { createContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";
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
import { fetchAllStaffs } from "@/firebase/queries/staffs";
import { fetchHotelData } from "@/firebase/queries/hotelInfo";
import { registerForPushNotificationsAsync } from "@/firebase/messaging";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [liveOrders, setLiveOrders] = useState();
  const [liveTables, setLiveTables] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [hotel, setHotel] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotelDetails = async () => {
      const hotelDetails = await fetchHotelData();
      if (hotelDetails) {
        setHotel(hotelDetails);
      }
    };

    fetchHotelDetails();
  }, []);

  const setLoggedInUserDetails = (user) => {
    const staff = staffs?.find((staff) => staff.authId == user.uid);
    setUser({
      ...user,
      staffDetails: staff,
      preferredLanguage: staff?.preferredLanguage || appDefaultLanguage,
    });
  };

  useEffect(() => {
    if (user && user != null) setLoggedInUserDetails(user);
  }, [staffs]);

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
          await fetchAllStaffs(setStaffs);
          await fetchAllTables(setLiveTables, undefined);
          setLoggedInUserDetails(firebaseUser);

          // Register for push notifications
          const token = await registerForPushNotificationsAsync();
          if (token) {
            // TODO: Send this token to your server and associate it with the user
            console.log("Push Notification:", token);
          }

          // Set up message handler
          if (Platform.OS === "android") {
            const unsubscribe = messaging().onMessage(onMessageReceived);
            return () => unsubscribe();
          } else if (Platform.OS === "web") {
            // For web, you might want to use Firebase's onMessage here
            // This depends on how you've set up Firebase for web
            Notification.requestPermission().then((permission) => {
              if (permission === "granted") {
                console.log("Notification permission granted.");
              }
            });
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return () => subscriber();
    };

    initializeAuth();
  }, []);

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

  const logout = async () => {
    await auth.signOut();
    setUser(null);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <AuthContext.Provider
      value={{ user, logout, liveTables, liveOrders, staffs, hotel }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
