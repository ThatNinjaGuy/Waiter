import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import SidebarItem from "./SidebarItem";

const Sidebar = ({ items, style, onItemClick, selectedItemIndex }) => {
  return (
    <ScrollView style={[styles.sidebar, style]}>
      {items.map((item, index) => (
        <SidebarItem
          key={index}
          title={item}
          style={index === selectedItemIndex ? styles.favorites : null}
          onItemClick={() => onItemClick(item, index)}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    backgroundColor: "#f0f0f0",
  },
  favorites: {
    backgroundColor: "rgba(46, 188, 59, 0.8)",
  },
});

export default Sidebar;
