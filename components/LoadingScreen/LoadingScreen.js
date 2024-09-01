import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import LottieView from "lottie-react-native";

const { width, height } = Dimensions.get("window");

const LoadingScreen = ({ message = "Fetching details for you..." }) => {
  return (
    <View style={styles.container}>
      <LottieView
        source={require("@/assets/animations/loading-animation.json")}
        autoPlay
        loop
        style={styles.animation}
      />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF", // or any color you prefer
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999, // Ensure it's on top of other components
  },
  animation: {
    width: width * 0.2, // Adjust size as needed
    height: width * 0.2,
  },
  text: {
    marginTop: 20,
    fontSize: 18,
    color: "#333",
    textAlign: "center",
  },
});

export default LoadingScreen;
