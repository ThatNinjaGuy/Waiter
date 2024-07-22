import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";

const SidebarItem = ({ title, style, onItemClick }) => {
  return (
    <TouchableOpacity style={[styles.item, style]} onPress={onItemClick}>
      <Text style={styles.itemTitle}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "rgba(91, 95, 112, 0.8)",
    marginBottom: "1%",
  },
  itemTitle: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default SidebarItem;
