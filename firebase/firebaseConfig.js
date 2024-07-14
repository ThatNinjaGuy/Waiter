import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

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
const db = getFirestore(app);

// db.settings({
//   persistence: true,
// });

export { db };
