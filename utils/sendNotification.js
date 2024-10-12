import { DEFAULT_NOTIFICATION_SETTINGS } from "@/constants/notificationControls";

export async function sendNotification(title, body, notificationTokens) {
  if (!notificationTokens || notificationTokens.length === 0) {
    console.log("No notification subscribers found");
    return;
  }
  try {
    const response = await fetch("https://notify-users.onrender.com/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tokens: notificationTokens,
        title,
        body,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send notification");
    }

    const result = await response.json();
    console.log("Notification sent successfully");
    return result;
  } catch (error) {
    console.error("Error sending notification:", error);
  }
}

export const identifyNotificationTokens = (staffs, notificationCategory) => {
  const notificationTokens = staffs
    .filter((staff) => {
      // Check if staff has notification tokens
      const hasTokens =
        staff.notificationTokens && staff.notificationTokens.length > 0;

      // If notificationSettings is not set, use DEFAULT_NOTIFICATION_SETTINGS
      const notificationEnabled = staff.notificationSettings
        ? staff.notificationSettings[notificationCategory]
        : DEFAULT_NOTIFICATION_SETTINGS[notificationCategory];

      return hasTokens && notificationEnabled;
    })
    .flatMap((staff) => staff.notificationTokens);

  // Remove duplicates
  return [...new Set(notificationTokens)];
};
