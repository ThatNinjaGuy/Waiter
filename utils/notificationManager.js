import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { onMessageReceived } from "@/firebase/messaging";
import { messaging } from "@/firebase/firebaseConfig";
import { onMessage } from "firebase/messaging";

export const initializeNotifications = () => {
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
  if (platform !== "web") {
    if (messaging) {
      messaging().onMessage(async (remoteMessage) => {
        await showNotification(remoteMessage);
      });
      messaging().setBackgroundMessageHandler(async (remoteMessage) => {
        await showNotification(remoteMessage);
      });
    }
  } else if (Platform.OS === "web" && typeof Notification !== "undefined") {
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
