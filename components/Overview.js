import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/common/ThemedText";

const Overview = ({ overviewItems }) => {
  return (
    <View style={styles.container}>
      {overviewItems.map((item) => (
        <View key={item.id} style={styles.overviewItem}>
          <ThemedText>{item.title}</ThemedText>
          <ThemedText>{" : "}</ThemedText>
          <ThemedText>{item.message}</ThemedText>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  overviewItem: {
    flexDirection: "row",
    marginTop: 5,
    marginBottom: 5,
    width: 150,
  },
});

export default Overview;
