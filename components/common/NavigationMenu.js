import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { ThemedText } from "./ThemedText";

const NavigationMenu = ({ items }) => {
  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <Pressable key={index} style={styles.item} onPress={item.onPress}>
          <ThemedText style={styles.title}>{item.title}</ThemedText>
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
    margin: hp("2%"),
  },
  item: {
    margin: hp("2%"),
    width: wp("30%"),
    paddingVertical: hp("2%"),
    paddingHorizontal: hp("2%"),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    borderRadius: wp("1%"),
  },
});

export default NavigationMenu;
