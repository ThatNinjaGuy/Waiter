import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { ThemedText } from "./common/ThemedText";

const UserProfile = ({ name, role, imageUrl }) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.textContainer}>
        <ThemedText style={styles.title}>{name}</ThemedText>
        <ThemedText style={styles.subtitle}>{role}</ThemedText>
      </View>
    </View>
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
