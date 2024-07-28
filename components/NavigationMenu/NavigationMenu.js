import React from "react";
import { StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { ThemedText } from "../common/ThemedText";
import { ThemedView } from "../common/ThemedView";
import ThemedButton from "../common/ThemedButton";

const NavigationMenu = ({ items }) => {
  return (
    <ThemedView style={styles.container}>
      {items.map((item, index) => (
        <ThemedButton
          key={index}
          style={styles.item}
          onPress={item.onPress}
          type="primary"
        >
          <ThemedText style={styles.title}>{item.title}</ThemedText>
        </ThemedButton>
      ))}
    </ThemedView>
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
  },
});

export default NavigationMenu;
