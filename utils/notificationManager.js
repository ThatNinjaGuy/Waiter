import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import {
  onMessageReceived,
} from "@/firebase/messaging";
import { messaging } from "@/firebase/firebaseConfig";
import { onMessage } from "firebase/messaging";

export const initializeNotifications = () => {
  //   registerForPushNotificationsAsync();

  const notificationListener = Notifications.addNotificationReceivedListener(
    (notification) => {
      console.log("Notification received:", notification);
    }
  );

  const responseListener =
    Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("Notification response received:", response);
    });

  return () => {
    Notifications.removeNotificationSubscription(notificationListener);
    Notifications.removeNotificationSubscription(responseListener);
  };
};

export const setupNotificationHandler = () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
};

export const setupMessageHandler = async (platform) => {
  // Register for push notifications
  //   await registerForPushNotificationsAsync();

  if (platform !== "web") {
    console.log("Setting up message handler for Android");
    if (messaging) {
      messaging().onMessage(async (remoteMessage) => {
        console.log("Foreground message received:", remoteMessage);
        await showNotification(remoteMessage);
      });
      messaging().setBackgroundMessageHandler(async (remoteMessage) => {
        console.log("Background message received:", remoteMessage);
        await showNotification(remoteMessage);
      });
      console.log("Successful set up message handler for Android");
    }
  } else if (Platform.OS === "web" && typeof Notification !== "undefined") {
    console.log("Requesting notification permission");
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        console.log("Notification permission granted.");
        if (messaging && typeof onMessage === "function") {
          onMessage(messaging, onMessageReceived);
        }
      } else {
        console.log("Notification permission denied.");
      }
    });
  }
};

export const showNotification = async (remoteMessage) => {
  const { title, body } =
    remoteMessage.notification || remoteMessage.data || {};
  await Notifications.scheduleNotificationAsync({
    content: {
      title: title || "New Message",
      body: body || "You have a new notification",
      data: remoteMessage.data,
    },
    trigger: null,
  });
};
