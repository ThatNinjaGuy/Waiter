import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/common/ThemedText";

const Overview = ({ overviewItems }) => {
  return (
    <View style={styles.overviewContainer}>
      {overviewItems.map((item) => (
        <View key={item.id} style={styles.overviewItem}>
          <ThemedText style={styles.itemTitle}>{item.title}</ThemedText>
          <ThemedText style={styles.itemMessage}>{item.message}</ThemedText>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  overviewContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginTop: 16,
  },
  overviewItem: {
    width: "45%",
    marginBottom: 16,
    alignItems: "center",
  },
  itemTitle: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  itemMessage: {
    textAlign: "center",
  },
});

export default Overview;
