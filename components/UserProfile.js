import React from "react";
import { Image, StyleSheet } from "react-native";
import { ThemedText } from "./common/ThemedText";
import { ThemedView } from "./common/ThemedView";

const UserProfile = ({ name, role, imageUrl }) => {
  return (
    <ThemedView>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <ThemedView style={styles.textContainer}>
        <ThemedText style={styles.title}>{name}</ThemedText>
        <ThemedText style={styles.subtitle}>{role}</ThemedText>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    justifyContent: "center",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
  },
  role: {
    fontSize: 14,
  },
});

export default UserProfile;
