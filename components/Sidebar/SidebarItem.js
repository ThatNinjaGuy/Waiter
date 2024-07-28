import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { ThemedText } from "../common/ThemedText";
import ThemedButton from "../common/ThemedButton";

const SidebarItem = ({ title, style, onItemClick }) => {
  return (
    <ThemedButton
      style={[styles.item, style]}
      onPress={onItemClick}
      type="primary"
    >
      <ThemedText style={styles.itemTitle}>{title}</ThemedText>
    </ThemedButton>
  );
};

const styles = StyleSheet.create({
  item: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: "1%",
    borderRadius: 0,
  },
  itemTitle: {
    fontWeight: "bold",
  },
});

export default SidebarItem;
