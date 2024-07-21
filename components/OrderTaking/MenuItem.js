import React from "react";
import { Text, TouchableOpacity, StyleSheet, View } from "react-native";

// Define the colors for different item types
const typeColors = {
  vegetarian: "green",
  egg: "yellow",
  nonVeg: "red",
  vegan: "purple",
};

// Function to determine the background color based on order count percentile
const getBackgroundColor = (orderCountPercentile, available) => {
  if (!available) return "#d3d3d3"; // Disabled color
  if (orderCountPercentile > 75) return "#ff6347"; // Hot color
  if (orderCountPercentile > 50) return "#ffcccb"; // Medium color
  return "#fff"; // Default color
};

const MenuItem = ({ item, onItemClick }) => {
  const { name, type, orderCountPercentile, available } = item;
  const typeColor = typeColors[type] || "transparent";
  const backgroundColor = getBackgroundColor(orderCountPercentile, available);

  return (
    <TouchableOpacity
      style={[styles.menuItem, { backgroundColor }]}
      onPress={onItemClick}
    >
      <Text>{name}</Text>
      <View style={[styles.typeIndicator, { backgroundColor: typeColor }]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    width: "20%",
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
