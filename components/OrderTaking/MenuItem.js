import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import ThemedButton from "../common/ThemedButton";
import { ThemedText } from "../common/ThemedText";
import { ThemedView } from "../common/ThemedView";

// Define the colors for different item types
const typeColors = {
  Veg: "green",
  Egg: "yellow",
  "Non-Veg": "red",
  Vegan: "purple",
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

  const { width } = useWindowDimensions();
  const [layoutParams, setLayoutParams] = useState({
    itemWidth: 200,
    numColumns: 1,
    containerPadding: 0,
  });
  const [key, setKey] = useState(0);

  const calculateLayout = useCallback(() => {
    const isLargeScreen = width > 768;
    let itemWidth = isLargeScreen ? 200 : 120; // Initial fixed width for each item
    const itemMargin = 20;
    const usableWidth = width - 150; //Size of sidebar
    const numColumns = Math.max(
      1,
      Math.floor((usableWidth - itemMargin) / (itemWidth + itemMargin))
    );
    let containerPadding =
      (usableWidth - numColumns * (itemWidth + itemMargin)) / 2;

    if (containerPadding > itemMargin) {
      itemWidth += (containerPadding - itemMargin) / numColumns;
      containerPadding = itemMargin;
    }

    return { itemWidth, numColumns, containerPadding };
  }, [width]);

  useEffect(() => {
    const newLayoutParams = calculateLayout();
    setLayoutParams(newLayoutParams);
    setKey((prevKey) => prevKey + 1); // Update key to force re-render
  }, [calculateLayout]);

  return (
    <ThemedButton
      style={[
        styles.menuItem,
        { backgroundColor },
        { width: layoutParams.itemWidth, margin: 10 },
      ]}
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
    height: 120,
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
