import { Platform } from "react-native";
import React, { createContext, useState, useEffect } from "react";
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
import {
  registerForPushNotificationsAsync,
  onMessageReceived,
} from "@/firebase/messaging";
import { auth, messaging, firebase } from "@/firebase/firebaseConfig";
import { onMessage } from "firebase/messaging";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [liveOrders, setLiveOrders] = useState();
  const [liveTables, setLiveTables] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [hotel, setHotel] = useState();
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  const fetchHotelDetails = async () => {
    try {
      const hotelDetails = await fetchHotelData();
      if (hotelDetails) {
        setHotel(hotelDetails);
      }
    } catch (error) {
      console.error("Error fetching hotel details:", error);
    }
  };

  const setLoggedInUserDetails = (user) => {
    const staff = staffs?.find((staff) => staff.authId === user.uid);
    setUser({
      ...user,
      staffDetails: staff,
      preferredLanguage: staff?.preferredLanguage || appDefaultLanguage,
    });
  };

  useEffect(() => {
    if (user) setLoggedInUserDetails(user);
  }, [staffs]);

  useEffect(() => {
    const newOrders = extractOrdersFromTable(liveTables);
    const { updated } = identifyChangedOrders(liveOrders, newOrders);
    publishNotifications(updated);

    setLiveOrders(newOrders);
  }, [liveTables]);

  useEffect(() => {
    const initializeAuth = async () => {
      if (Platform.OS === "web") {
        // For web, wait for auth to be initialized
        const checkAuth = setInterval(() => {
          if (auth && typeof auth.onAuthStateChanged === "function") {
            clearInterval(checkAuth);
            setAuthInitialized(true);
          }
        }, 100);
      } else {
        // For native platforms
        const checkAuth = setInterval(() => {
          if (auth && typeof auth.onAuthStateChanged === "function") {
            clearInterval(checkAuth);
            setAuthInitialized(true);
            console.log("Auth initialized");
          }
        }, 100);
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    if (!authInitialized) return;

    const unsubscribeAuth =
      Platform.OS === "web"
        ? auth.onAuthStateChanged(handleAuthStateChange)
        : auth.onAuthStateChanged(handleAuthStateChange);

    return () => unsubscribeAuth();
  }, [authInitialized]);

  const handleAuthStateChange = async (firebaseUser) => {
    if (firebaseUser) {
      try {
        await fetchAllStaffs(setStaffs);
        await fetchAllTables(setLiveTables, undefined);
        setLoggedInUserDetails(firebaseUser);
        await fetchHotelDetails();

        // Register for push notifications
        const token = await registerForPushNotificationsAsync();
        if (token) {
          console.log("Push Notification Token:", token);
        }

        // Set up message handler
        if (Platform.OS !== "web" && messaging) {
          const unsubscribeMessage = messaging.onMessage(onMessageReceived);
          return () => unsubscribeMessage();
        } else if (
          Platform.OS === "web" &&
          typeof Notification !== "undefined"
        ) {
          Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
              console.log("Notification permission granted.");
              onMessage(messaging, onMessageReceived);
            }
          });
        }
      } catch (error) {
        console.error("Error during authentication state change:", error);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
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

  const logout = async () => {
    try {
      if (Platform.OS === "web") {
        await auth.signOut();
      } else {
        await auth().signOut();
      }
      setUser(null);
    } catch (error) {
      console.error("Error during logout:", error);
    }
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
