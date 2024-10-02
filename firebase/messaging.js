import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { messaging } from "./firebaseConfig"; // Import your Firebase app instance
import { getToken } from "firebase/messaging";

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "web") {
    try {
      if (messaging) {
        token = await getToken(messaging, {
          vapidKey:
            "BECTGATgqCCtMrHEuAMi1NzrTP06XRvi6C_MBMviG13Q-VdXCBsGyM9Cg0CTIhLCp9WPKRztai-uDaYMc9vrZT0",
        });
      } else {
        console.log("Messaging is not supported in this browser");
      }
    } catch (error) {
      console.error("An error occurred while retrieving token. ", error);
    }
  } else if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }

    if (Platform.OS === "android") {
      await messaging().registerDeviceForRemoteMessages();
      token = await messaging().getToken();
    } else {
      token = (await Notifications.getExpoPushTokenAsync()).data;
    }
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}

export async function onMessageReceived(message) {
  if (Platform.OS === "android") {
    // Handle Android foreground notifications
    const { title, body } = message.notification;
    Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
      },
      trigger: null,
    });
  } else if (Platform.OS === "web") {
    // Handle web notifications
    if (Notification.permission === "granted") {
      new Notification(message.notification.title, {
        body: message.notification.body,
      });
    }
  } else {
    // Handle mobile notifications
    const { title, body } = message.notification;

    Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
      },
      trigger: null,
    });
  }
}
