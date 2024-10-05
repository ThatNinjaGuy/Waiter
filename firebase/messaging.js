import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { messaging } from "./firebaseConfig"; // Import your Firebase app instance
import { getToken } from "firebase/messaging";
import { updateStaff } from "@/firebase/queries/staffs";

export async function registerForPushNotificationsAsync(user, allUsers) {
  if (!user || !allUsers) return;
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

    // Fetch token for mobile platforms
    if (Platform.OS === "android") {
      if (messaging) {
        await messaging().registerDeviceForRemoteMessages();
        token = await messaging().getToken();
      }
    } else {
      //   token = (await Notifications.getExpoPushTokenAsync()).data;
    }
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (token && token != user.notificationToken) {
    updateStaff(
      user.id,
      {
        ...user,
        notificationToken: token,
      },
      allUsers,
      undefined,
      undefined
    );
  }
  return token;
}

export async function onMessageReceived(message) {
  console.log("Received message:", message);

  if (Platform.OS === "web") {
    // Handle web notifications
    if (Notification.permission === "granted") {
      try {
        const { title, body, icon } =
          message.notification || message.data || {};

        // Check if the browser supports notifications
        if (!("Notification" in window)) {
          console.log("This browser does not support desktop notification");
          return;
        }
        console.log("Showing web notification");

        // Create and show the notification
        const notification = new Notification(title || "New Message", {
          body: body || "You have a new notification",
          //   icon: icon || "/path/to/default/icon.png", // Add a path to your default app icon
          tag: "new-message", // Unique identifier for the notification
          requireInteraction: true, // Keep the notification visible until the user interacts with it
        });

        console.log("Notification created successfully", notification);
        notification.onclick = function () {
          console.log("Notification clicked");
          window.focus();
          notification.close();
        };

        notification.onshow = function () {
          console.log("Notification shown successfully");
        };

        notification.onerror = function (error) {
          console.error("Error showing notification:", error);
        };
      } catch (error) {
        console.error("Error creating web notification:", error);
      }
    } else {
      console.log("Notification permission not granted for web");
      // Optionally, you can request permission here
      Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {
          console.log("Notification permission granted.");
          // You can call onMessageReceived again here to show the notification
        }
      });
    }
  } else {
    // Handle mobile notifications (Android and iOS)
    const { title, body } = message.notification || message.data || {};
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title || "New Message",
        body: body || "You have a new notification",
        data: message.data,
      },
      trigger: null,
    });
  }
}
