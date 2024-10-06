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
    console.log("Notification sent successfully:", result);
    return result;
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
}

export const identifyNotificationTokens = (staffs) => {
  const notificationKeys = staffs
    .filter((staff) => staff.notificationToken)
    .map((staff) => staff.notificationToken);
  return notificationKeys;
};
