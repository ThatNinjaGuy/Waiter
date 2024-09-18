import React, { useEffect } from "react";
import * as Notifications from "expo-notifications";

// Configure notification settings
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const NotificationComponent = () => {
  useEffect(() => {
    const getPermissions = async () => {
      try {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== "granted") {
          alert("Please enable notifications");
        }
      } catch (error) {
        console.error("Error requesting notification permissions:", error);
      }
    };

    getPermissions();
  }, []);

  return null; // This component doesn't render anything
};

export const playNotificationSounds = async () => {
  console.log("Play notification");
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "You've got mail! 📬",
        body: "Here is the notification body",
      },
      trigger: { seconds: 2 },
    });
  } catch (error) {
    console.error("Error scheduling notification:", error);
  }
};

export default NotificationComponent;
