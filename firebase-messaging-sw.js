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
  const notificationTitle = payload.notification.title || "New Notification";
  const notificationOptions = {
    body: payload.notification.body || "You have a new message",
    // icon: "/path/to/your/icon.png", // Replace with the path to your app icon
    // badge: "/path/to/your/badge.png", // Replace with the path to your badge icon
    tag: "new-message", // Unique identifier for the notification
    data: payload.data, // Include any additional data from the payload
    requireInteraction: true, // Keep the notification visible until the user interacts with it
    actions: [
      {
        action: "open",
        title: "Open App",
      },
      {
        action: "close",
        title: "Dismiss",
      },
    ],
  };

  console.log(
    "Attempting to show notification:",
    notificationTitle,
    notificationOptions
  );

  return self.registration
    .showNotification(notificationTitle, notificationOptions)
    .then(() => {
      console.log("Notification shown successfully");
    })
    .catch((error) => {
      console.error("Error showing notification:", error);
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    });
});

self.addEventListener("notificationclick", function (event) {
  console.log("[Service Worker] Push Received.");
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

  const data = JSON.parse(event.data.text());
  const title = data.notification.title || "Push Notification";
  const options = {
    body: data.notification.body || "Default message body",
    // icon: "/path/to/icon.png",
    // badge: "/path/to/badge.png",
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
