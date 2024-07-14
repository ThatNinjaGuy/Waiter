import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

const Notifications = ({ notifications }) => {
  const renderItem = ({ item }) => (
    <View style={styles.notificationItem}>
      <Text style={styles.notificationText}>{item.message}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  notificationItem: {
    backgroundColor: "rgba(170, 183, 225, 0.5)",
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
  },
  notificationText: {
    fontSize: 14,
    color: "#fff",
  },
});

export default Notifications;
