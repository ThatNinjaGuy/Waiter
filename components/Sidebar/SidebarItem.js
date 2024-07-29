import React from "react";
import { StyleSheet } from "react-native";
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
    borderBottomWidth: 1,
    height: 80,
    borderBottomColor: "#ccc",
    marginBottom: "1%",
    borderRadius: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  itemTitle: {
    fontWeight: "bold",
  },
});

export default SidebarItem;
