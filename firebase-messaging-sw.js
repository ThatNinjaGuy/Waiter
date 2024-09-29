importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

// Initialize the Firebase app in the service worker by passing in the messagingSenderId.
firebase.initializeApp({
  apiKey: "AIzaSyBNlZDqGxMyI83DbW4hY0qd4KAJA3ynW2Q",
  authDomain: "waiter-dev-ca07d.firebaseapp.com",
  projectId: "waiter-dev-ca07d",
  storageBucket: "waiter-dev-ca07d.appspot.com",
  messagingSenderId: "699328756162",
  appId: "1:699328756162:web:f11e002f4f3dd23bd23e5b",
  measurementId: "G-F4YF1WECQR",
});

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    // icon: "/firebase-logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
