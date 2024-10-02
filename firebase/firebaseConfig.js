import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
};

if (Platform.OS === "web") {
  // Web Firebase setup
  import("firebase/app").then((firebaseApp) => {
    import("firebase/auth").then((firebaseAuth) => {
      import("firebase/firestore").then((firebaseFirestore) => {
        import("firebase/messaging").then((firebaseMessaging) => {
          const app = firebaseApp.initializeApp(firebaseConfig);
          auth = firebaseAuth.getAuth(app);
          firebaseAuth.setPersistence(
            auth,
            firebaseAuth.browserLocalPersistence
          );
          firestore = firebaseFirestore.getFirestore(app);
          if (typeof window !== "undefined" && "serviceWorker" in navigator) {
            messaging = firebaseMessaging.getMessaging(app);
          }
        });
      });
    });
  });
} else {
  // React Native Firebase setup
  import("@react-native-firebase/app")
    .then((firebaseApp) => {
      firebase = firebaseApp.default;
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }

      Promise.all([
        import("@react-native-firebase/auth"),
        import("@react-native-firebase/firestore"),
        import("@react-native-firebase/messaging"),
      ])
        .then(([firebaseAuth, firebaseFirestore, firebaseMessaging]) => {
          auth = firebaseAuth.default();
          firestore = firebaseFirestore.default();
          messaging = firebaseMessaging.default();
        })
        .catch((error) => {
          console.error("Error initializing Firebase modules:", error);
        });
    })
    .catch((error) => {
      console.error("Error importing @react-native-firebase/app:", error);
    });
}

export { firebase, auth, firestore as db, messaging, firebaseConfig };
