import React from "react";
import { StyleSheet, TouchableOpacity, Text, Pressable } from "react-native";
import { ThemedText } from "../common/ThemedText";
import ThemedButton from "../common/ThemedButton";
import { ThemedView } from "../common/ThemedView";

const FloatingCloseButton = ({ onClose }) => {
  return (
    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
      <Text style={styles.closeButtonText}>X</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default FloatingCloseButton;
