import { Platform } from "react-native";
import React, { createContext, useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
const getSavedRestaurantPath = async () => {
  try {
    const savedPath = await AsyncStorage.getItem("restaurantPath");
    return savedPath ? JSON.parse(savedPath) : null;
  } catch (error) {
    console.error("Error loading saved restaurant path:", error);
    return null;
  }
};

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
  const [restaurantPath, setRestaurantPath] = useState(null);

  useEffect(() => {
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {});

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {});

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

  useEffect(() => {
    const loadSavedRestaurantPath = async () => {
      const savedPath = await getSavedRestaurantPath();
      setRestaurantPath(savedPath);
    };
    loadSavedRestaurantPath();
  }, []);

  const fetchHotelDetails = async (restaurantPath) => {
    try {
      const hotelDetails = await fetchHotelData(restaurantPath);
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
    if (staff) {
      registerForPushNotificationsAsync(restaurantPath, staff, staffs);
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
  }, [authInitialized, restaurantPath]);

  const handleAuthStateChange = async (firebaseUser) => {
    if (firebaseUser) {
      try {
        setFirebaseUser(firebaseUser);

        if (restaurantPath && restaurantPath.restaurantId) {
          await fetchAllStaffs(restaurantPath, setStaffs);
          await fetchAllTables(restaurantPath, setLiveTables);
          await fetchHotelDetails(restaurantPath);
        } else {
          console.log("No valid restaurant path found");
          // You might want to redirect to a restaurant selection screen here
        }

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

  const updateRestaurantPath = async (newPath) => {
    try {
      if (JSON.stringify(newPath) !== JSON.stringify(restaurantPath)) {
        setRestaurantPath(newPath);
        await AsyncStorage.setItem("restaurantPath", JSON.stringify(newPath));

        // Fetch data for the new restaurant path
        await fetchAllStaffs(newPath, setStaffs);
        await fetchAllTables(newPath, setLiveTables);
        await fetchHotelDetails(newPath);
      }
    } catch (error) {
      console.error("Error updating restaurant path:", error);
    }
  };

  useEffect(() => {
    if (restaurantPath && firebaseUser) {
      fetchAllStaffs(restaurantPath, setStaffs);
      fetchAllTables(restaurantPath, setLiveTables);
      fetchHotelDetails(restaurantPath);
    }
  }, [restaurantPath, firebaseUser]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        logout,
        liveTables,
        liveOrders,
        staffs,
        hotel,
        restaurantPath,
        updateRestaurantPath,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
