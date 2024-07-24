import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const NavigationMenu = ({ items }) => {
  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <Pressable key={index} style={styles.item} onPress={item.onPress}>
          <Text style={styles.itemText}>{item.title}</Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: hp("2%"),
  },
  item: {
    width: wp("40%"), // 40% of the screen width
    height: hp("10%"), // 20% of the screen height
    padding: hp("1%"),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    borderRadius: wp("2%"),
    marginBottom: hp("2%"),
  },
  itemText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: wp("4%"), // Responsive font size
  },
});

export default NavigationMenu;
