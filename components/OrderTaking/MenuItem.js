import React from "react";
import { StyleSheet } from "react-native";
import ThemedButton from "../common/ThemedButton";
import { ThemedText } from "../common/ThemedText";
import { ThemedView } from "../common/ThemedView";

// Define the colors for different item types
const typeColors = {
  vegetarian: "green",
  egg: "yellow",
  nonVeg: "red",
  vegan: "purple",
};

// Function to determine the background color based on order count percentile
const getBackgroundColor = (orderCountPercentile, available) => {
  if (!available) return "rgba(95, 95, 123, 0.8)"; // Disabled color
  if (orderCountPercentile > 75) return "#ff6347"; // Hot color
  if (orderCountPercentile > 50) return "rgba(150, 114, 49, 0.8)"; // Medium color
  return "rgba(49, 150, 146, 0.8)"; // Default color
};

const MenuItem = ({ item, onItemClick }) => {
  const { name, type, orderCountPercentile, available } = item;
  const typeColor = typeColors[type] || "transparent";
  const backgroundColor = getBackgroundColor(orderCountPercentile, available);

  return (
    <ThemedButton
      style={[styles.menuItem, { backgroundColor }]}
      onPress={onItemClick}
    >
      <ThemedView
        style={[styles.typeIndicator, { backgroundColor: typeColor }]}
      />
      <ThemedText>{name}</ThemedText>
    </ThemedButton>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    // width: "22%",
    height: 100,
    padding: 10,
    margin: "1%",
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    borderRadius: 10,
  },
  typeIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    position: "absolute",
    top: 10,
    right: 10,
  },
});

export default MenuItem;
