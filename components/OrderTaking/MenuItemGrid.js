import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import MenuItem from "./MenuItem";
import { ScrollView } from "react-native-gesture-handler";
import { ThemedView } from "../common/ThemedView";

const MenuItemGrid = ({ menuItems, onItemClick, style }) => {
  const [sortedMenuItems, setSortedMenuItems] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filterAndSortMenuItems = (items, term) => {
    // First, filter the items based on the search term
    const filteredItems =
      term || term === ""
        ? items.filter(
            (item) =>
              item.name.toLowerCase().includes(term.toLowerCase()) ||
              item.searchableKey.toLowerCase().includes(term.toLowerCase())
          )
        : items;

    // Then, sort the filtered items
    return filteredItems.sort((a, b) => {
      if (a.available === b.available) {
        return b.orderCountPercentile - a.orderCountPercentile;
      }
      return a.available ? -1 : 1;
    });
  };

  useEffect(() => {
    if (menuItems) {
      const filteredAndSortedItems = filterAndSortMenuItems(
        menuItems,
        searchTerm
      );
      setSortedMenuItems(filteredAndSortedItems);
    }
  }, [menuItems, searchTerm]);

  const handleItemClick = (item, index) => {
    setSearchTerm("");
    onItemClick(item, index);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.inputIcon}>🔍</Text>
        <TextInput
          style={styles.input}
          placeholder="Search menu"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>
      <ThemedView style={[styles.grid, style]}>
        {sortedMenuItems?.map((item, index) => (
          <MenuItem
            key={index}
            item={item}
            onItemClick={() => handleItemClick(item, index)}
          />
        ))}
      </ThemedView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    // width: "50%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    width: "100%",
  },
  inputIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: "#333",
  },
  grid: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
});

export default MenuItemGrid;
