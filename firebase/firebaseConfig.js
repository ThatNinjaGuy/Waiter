import { Platform } from "react-native";

let firebase, auth, firestore, messaging;

// DEV configs
const firebaseConfig = {
  apiKey: "AIzaSyBNlZDqGxMyI83DbW4hY0qd4KAJA3ynW2Q",
  authDomain: "waiter-dev-ca07d.firebaseapp.com",
  projectId: "waiter-dev-ca07d",
  storageBucket: "waiter-dev-ca07d.appspot.com",
  messagingSenderId: "699328756162",
  appId: "1:699328756162:web:f11e002f4f3dd23bd23e5b",
  measurementId: "G-F4YF1WECQR",
  databaseURL: "https://waiter-dev-ca07d.firebaseio.com",
};

async function initializeFirebase() {
  try {
    if (Platform.OS === "web") {
      const firebaseApp = await import("firebase/app");
      const firebaseAuth = await import("firebase/auth");
      const firebaseFirestore = await import("firebase/firestore");
      const firebaseMessaging = await import("firebase/messaging");

      const app = firebaseApp.initializeApp(firebaseConfig);
      auth = firebaseAuth.getAuth(app);
      firebaseAuth.setPersistence(auth, firebaseAuth.browserLocalPersistence);
      firestore = firebaseFirestore.getFirestore(app);

      if (typeof window !== "undefined" && "serviceWorker" in navigator) {
        messaging = firebaseMessaging.getMessaging(app);
        if ("serviceWorker" in navigator) {
          navigator.serviceWorker
            .register("/firebase-messaging-sw.js")
            .then((registration) => {
              console.log(
                "Service Worker registered with scope:",
                registration.scope
              );
            })
            .catch(function (error) {
              console.log("Service Worker registration failed:", error);
            });
        }
      }
    } else {
      const firebaseApp = await import("@react-native-firebase/app");
      firebase = firebaseApp.default;

      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }

      const [firebaseAuth, firebaseFirestore, firebaseMessaging] =
        await Promise.all([
          import("@react-native-firebase/auth"),
          import("@react-native-firebase/firestore"),
          import("@react-native-firebase/messaging"),
        ]);

      auth = firebaseAuth.default();
      firestore = firebaseFirestore.default();
      messaging = firebaseMessaging.default;
    }
  } catch (error) {
    console.error("Error initializing Firebase:", error);
  }
}

initializeFirebase();

export { firebase, auth, firestore as db, messaging, firebaseConfig };
