import { initializeApp } from "firebase/app";
import { initializeFirestore, CACHE_SIZE_UNLIMITED } from "firebase/firestore";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { getMessaging } from "firebase/messaging";

// PROD configs
// {Replace DEV configs for PROD builds}

// DEV configs
const firebaseConfig = {
  apiKey: "AIzaSyBNlZDqGxMyI83DbW4hY0qd4KAJA3ynW2Q",
  authDomain: "waiter-dev-ca07d.firebaseapp.com",
  projectId: "waiter-dev-ca07d",
  storageBucket: "waiter-dev-ca07d.appspot.com",
  messagingSenderId: "699328756162",
  appId: "1:699328756162:web:f11e002f4f3dd23bd23e5b",
  measurementId: "G-F4YF1WECQR",
};

const app = initializeApp(firebaseConfig);

let auth;

if (Platform.OS === "web") {
  auth = getAuth(app);
  // Set persistence for web
  import("firebase/auth").then(
    ({ browserLocalPersistence, setPersistence }) => {
      setPersistence(auth, browserLocalPersistence);
    }
  );
} else {
  // Initialize auth with AsyncStorage persistence for React Native
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

// Initialize Firestore with persistent local cache
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  synchronizeTabs: true,
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
});

export { auth, db, firebaseConfig };
