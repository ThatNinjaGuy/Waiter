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

    // <View style={styles.overviewContainer}>
    //   {notifications.map((item) => (
    //     <View key={item.id} style={styles.overviewItem}>
    //       <ThemedText style={styles.itemTitle}>{item.title}</ThemedText>
    //       <ThemedText style={styles.itemMessage}>{item.message}</ThemedText>
    //     </View>
    //   ))}
    // </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
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
