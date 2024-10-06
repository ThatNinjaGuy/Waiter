export async function sendNotification(title, body) {
  const token = getRecieverToken();
  try {
    const response = await fetch("https://notify-users.onrender.com/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
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

function getRecieverToken() {
  return "f73pSpXZTyySLZUnFN2gHz:APA91bFUMvGOFWI6Fvfi1K6mT8myJqXfWYff5JX6DVSFnjBFJuyb9vQAYMLTwicd0X_MckznyVrHTqEbCFKekbyRig9X64lxdIpLUUKBDyTQb_Tl5VEIGrnoCgtpyiH6Wo7MAs3LCK-c";
}
