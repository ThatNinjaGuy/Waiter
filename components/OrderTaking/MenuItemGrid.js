import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import MenuItem from "./MenuItem";
import { ScrollView } from "react-native-gesture-handler";

const MenuItemGrid = ({ menuItems, onItemClick, style }) => {
  const [sortedMenuItems, setSortedMenuItems] = useState(null);

  const sortMenuItems = () =>
    menuItems?.sort((a, b) => {
      if (a.available === b.available) {
        return b.orderCountPercentile - a.orderCountPercentile;
      }
      return a.available ? -1 : 1;
    });

  useEffect(() => {
    setSortedMenuItems(sortMenuItems);
  }, [menuItems]);

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.grid, style]}>
        {sortedMenuItems?.map((item, index) => (
          <MenuItem
            key={index}
            item={item}
            onItemClick={() => onItemClick(item, index)}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "50%",
  },
  grid: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
});

export default MenuItemGrid;
