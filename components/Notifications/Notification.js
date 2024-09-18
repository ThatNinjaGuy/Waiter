import React, { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Configure notification settings for mobile
if (Platform.OS !== "web") {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

const NotificationComponent = () => {
  useEffect(() => {
    const getPermissions = async () => {
      try {
        if (Platform.OS === "web") {
          if (Notification.permission !== "granted") {
            const permission = await Notification.requestPermission();
            console.log("New Permission: ", permission);
            if (permission !== "granted") {
              alert("Please enable notifications");
            }
          }
        } else {
          const { status } = await Notifications.requestPermissionsAsync();
          if (status !== "granted") {
            alert("Please enable notifications");
          }
        }
      } catch (error) {
        console.error("Error requesting notification permissions:", error);
      }
    };

    getPermissions();
  }, []);

  return null; // This component doesn't render anything
};

export const sendNotificationToUser = async (title, body) => {
  try {
    if (Platform.OS === "web") {
      new Notification(title || "You've got mail! 📬", {
        body: body || "Here is the notification body",
      });
    } else {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: title || "You've got mail! 📬",
          body: body || "Here is the notification body",
        },
        trigger: { seconds: 1 },
      });
    }
  } catch (error) {
    console.error("Error scheduling notification:", error);
  }
};

export default NotificationComponent;
