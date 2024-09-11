import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

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

const auth = getAuth(app);

// Initialize Firestore with persistent local cache
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true, // Optional: Use if you face network issues
  synchronizeTabs: true,
});

export { auth, db, firebaseConfig };
