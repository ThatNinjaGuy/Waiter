import Sound from "react-native-sound";

export const playNotificationSound = async () => {
  const soundFile = require("../../assets/sounds/notificationsound.mp3");
  const sound = new Sound(soundFile, Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log("failed to load the sound", error);
      return;
    }
    // loaded successfully
    console.log("duration in seconds: " + sound.getDuration());
  });
  sound.play((success) => {
    if (success) {
      console.log("successfully finished playing");
    } else {
      console.log("playback failed due to audio decoding errors");
    }
  });
};
