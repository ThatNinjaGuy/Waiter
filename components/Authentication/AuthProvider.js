import { Platform } from "react-native";
import React, { createContext, useState, useEffect, useRef } from "react";
import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";
import { fetchAllTables } from "@/firebase/queries/tables";
import { extractOrdersFromTable } from "@/utils/orderManagement";
import { appDefaultLanguage } from "@/constants/appText/common";
import { fetchAllStaffs } from "@/firebase/queries/staffs";
import { fetchHotelData } from "@/firebase/queries/hotelInfo";
import { auth } from "@/firebase/firebaseConfig";
import {
  setupNotificationHandler,
  setupMessageHandler,
} from "@/utils/notificationManager";
import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "@/firebase/messaging";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [liveOrders, setLiveOrders] = useState();
  const [liveTables, setLiveTables] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [hotel, setHotel] = useState();
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("Notification received:", notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification response received:", response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    setupNotificationHandler();
  }, []);

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

  const setLoggedInUserDetails = () => {
    if (!staffs || !firebaseUser) return; // Add this check to prevent setting undefined user

    const staff = staffs?.find((staff) => staff.authId === firebaseUser.uid);
    setUser({
      staffDetails: staff,
      preferredLanguage: staff?.preferredLanguage || appDefaultLanguage,
    });
    if (staff && !staff?.notificationToken) {
      registerForPushNotificationsAsync(staff, staffs);
    }
  };

  useEffect(() => {
    if (staffs.length > 0) {
      setLoggedInUserDetails();
    }
  }, [staffs]);

  useEffect(() => {
    const newOrders = extractOrdersFromTable(liveTables);
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
          }
        }, 100);
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    if (!authInitialized) return;

    const unsubscribeAuth = auth.onAuthStateChanged(handleAuthStateChange);

    return () => unsubscribeAuth();
  }, [authInitialized]);

  const handleAuthStateChange = async (firebaseUser) => {
    if (firebaseUser) {
      try {
        await fetchAllStaffs(setStaffs);
        await fetchAllTables(setLiveTables, undefined);
        setFirebaseUser(firebaseUser);
        await fetchHotelDetails();
        // Set up message handler
        setupMessageHandler(Platform.OS);
      } catch (error) {
        console.error("Error during authentication state change:", error);
      }
    } else {
      setUser(null);
      setFirebaseUser(null);
    }
    setLoading(false);
  };

  const logout = async () => {
    try {
      if (Platform.OS === "web") {
        await auth.signOut();
      } else {
        await auth.signOut();
      }
      setUser(null);
      setFirebaseUser(null);
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
