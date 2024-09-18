import React from "react";
import { FlatList, StyleSheet } from "react-native";
import { ThemedText } from "@/components/common/ThemedText";
import { ThemedView } from "@/components/common/ThemedView";
import { ThemedButton } from "@/components/common/ThemedButton";

const NotificationsPanel = ({ notifications }) => {
  const renderItem = ({ item }) => (
    <ThemedButton style={styles.notificationItem} type="secondary">
      <ThemedText style={styles.notificationText}>{item.message}</ThemedText>
    </ThemedButton>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  notificationItem: {
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
    alignItems: "flex-start",
  },
  notificationText: {
    fontSize: 14,
  },
});

export default NotificationsPanel;
