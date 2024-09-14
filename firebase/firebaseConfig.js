import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyAN-nxJtF6ROGWMjLboI4dEBKDNGnsMIWg",
  authDomain: "waiter-44e49.firebaseapp.com",
  projectId: "waiter-44e49",
  storageBucket: "waiter-44e49.appspot.com",
  messagingSenderId: "217705150330",
  appId: "1:217705150330:web:cdba3b8696a30b1d5a08c3",
  measurementId: "G-EDWY1LPV92",
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
});

export { auth, db, firebaseConfig };
