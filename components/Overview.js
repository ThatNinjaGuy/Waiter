import React from "react";
import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/common/ThemedText";
import { ThemedView } from "@/components/common/ThemedView";

const Overview = ({ overviewItems }) => {
  return (
    <ThemedView style={styles.overviewContainer}>
      {overviewItems.map((item) => (
        <ThemedView key={item.title} style={styles.overviewItem}>
          <ThemedText style={styles.itemTitle}>{item.title}</ThemedText>
          <ThemedText style={styles.itemMessage}>{item.message}</ThemedText>
        </ThemedView>
      ))}
    </ThemedView>
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
