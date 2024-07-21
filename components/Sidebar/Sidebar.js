import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import SidebarItem from "./SidebarItem";

const Sidebar = ({ items, style, onItemClick }) => {
  return (
    <ScrollView style={[styles.sidebar, style]}>
      <SidebarItem
        title="Item Categories"
        style={styles.sidebarHeader}
        clickable={false}
      />
      <SidebarItem
        title="Favorite Items"
        style={styles.favorites}
        clickable={true}
        onItemClick={onItemClick}
      />
      {items.map((item, index) => (
        <SidebarItem
          key={index}
          title={item}
          clickable={true}
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
  sidebarHeader: {
    backgroundColor: "rgba(29, 61, 201, 0.8)",
  },
  favorites: {
    backgroundColor: "rgba(46, 188, 59, 0.8)",
  },
});

export default Sidebar;
