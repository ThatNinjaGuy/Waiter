import React, { useState, useEffect } from "react";
import { Image, StyleSheet } from "react-native";
import { ThemedText } from "./common/ThemedText";
import { ThemedView } from "./common/ThemedView";

// Define the colors for different item types
const typeColors = {
  Premium: "rgba(207, 167, 5, 0.86)",
  Free: "transparent",
};

const UserProfile = ({ name, role, imageUrl, plan }) => {
  const [typeColor, setTypeColor] = useState("transparent");
  useEffect(() => {
    setTypeColor(typeColors[plan] || typeColors["Free"]);
  }, [plan]);
  return (
    <ThemedView style={[styles.container, { backgroundColor: typeColor }]}>
      <Image
        source={{
          uri: imageUrl || "https://dummyimage.com/650x450/cc00cc/fff",
        }}
        style={styles.image}
      />
      <ThemedView
        style={[styles.textContainer, { backgroundColor: typeColor }]}
      >
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
    padding: 20,
    margin: 5,
    borderWidth: 1,
    borderRadius: 5,
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
