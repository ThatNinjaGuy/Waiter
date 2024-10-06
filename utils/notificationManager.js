import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { messaging } from "@/firebase/firebaseConfig";
import { onMessage } from "firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SHOWN_NOTIFICATIONS_KEY = "SHOWN_NOTIFICATIONS";
let shownNotifications = new Set();

const loadShownNotifications = async () => {
  try {
    const stored = await AsyncStorage.getItem(SHOWN_NOTIFICATIONS_KEY);
    if (stored) {
      shownNotifications = new Set(JSON.parse(stored));
    }
  } catch (error) {
    console.error("Error loading shown notifications:", error);
  }
};

const saveShownNotifications = async () => {
  try {
    await AsyncStorage.setItem(
      SHOWN_NOTIFICATIONS_KEY,
      JSON.stringify([...shownNotifications])
    );
  } catch (error) {
    console.error("Error saving shown notifications:", error);
  }
};

export const setupNotificationHandler = () => {
  if (Platform.OS !== "web") {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }
};

export const setupMessageHandler = async (platform) => {
  await loadShownNotifications();

  if (platform !== "web") {
    if (messaging) {
      messaging().onMessage(async (remoteMessage) => {
        await handleNotification(remoteMessage);
      });
    }
  } else if (platform === "web" && typeof Notification !== "undefined") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        console.log("Notification permission granted.");
        if (messaging && typeof onMessage === "function") {
          onMessage(messaging, (message) => handleNotification(message));
        }
      } else {
        console.log("Notification permission denied.");
      }
    });
  }
};

const handleNotification = async (remoteMessage) => {
  if (
    remoteMessage.messageId &&
    !shownNotifications.has(remoteMessage.messageId)
  ) {
    await showNotification(remoteMessage);
    shownNotifications.add(remoteMessage.messageId);
    await saveShownNotifications();
  }
};

export const showNotification = async (remoteMessage) => {
  const { title, body } =
    remoteMessage.notification || remoteMessage.data || {};
  if (!title || !body) return;

  if (Platform.OS === "web") {
    if (Notification.permission === "granted") {
      new Notification(title, {
        body: body,
        // icon: '/path/to/icon.png', // Add your icon path here
      });
    }
  } else {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
        data: remoteMessage.data,
      },
      trigger: null,
    });
  }
};
