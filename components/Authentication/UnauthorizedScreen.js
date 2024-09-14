import React from "react";
import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/common/ThemedText";
import { ThemedView } from "@/components/common/ThemedView";

const UnauthorizedScreen = () => {
  return (
    <ThemedView style={styles.container}>
      <ThemedText>You are unauthorized to access this page!</ThemedText>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default UnauthorizedScreen;
