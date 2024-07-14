// components/OrderDetails.js
import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

const OrderDetails = ({ order }) => {
  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemQuantity}>x{item.quantity}</Text>
      <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Details</Text>
      <FlatList
        data={order.items}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total:</Text>
        <Text style={styles.totalAmount}>${order.total.toFixed(2)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  itemName: {
    flex: 2,
  },
  itemQuantity: {
    flex: 1,
    textAlign: "center",
  },
  itemPrice: {
    flex: 1,
    textAlign: "right",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  totalText: {
    fontWeight: "bold",
  },
  totalAmount: {
    fontWeight: "bold",
  },
});

export default OrderDetails;
