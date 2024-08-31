import { ThemedText } from "@/components/common/ThemedText";
import { ThemedView } from "@/components/common/ThemedView";
import React, { useEffect } from "react";
import { StyleSheet, FlatList } from "react-native";
import {
  aggregateOrders,
  calculateOrderValue,
} from "../../utils/orderManagement";

const OrderDetails = ({ rawOrders }) => {
  const orders = aggregateOrders(rawOrders);
  const orderValue = calculateOrderValue(orders);

  const renderOrderItem = ({ item }) => (
    <ThemedView style={styles.orderItem}>
      <ThemedText style={styles.itemName}>{item.name}</ThemedText>
      <ThemedText style={styles.itemQuantity}>x{item.quantity}</ThemedText>
      <ThemedText style={styles.itemPrice}>₹{item.price.toFixed(2)}</ThemedText>
      <ThemedText style={styles.itemPrice}>
        ₹{item.itemValue.toFixed(2)}
      </ThemedText>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Order Details</ThemedText>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.name.toString() + item.category.toString()}
      />
      <ThemedView style={styles.totalContainer}>
        <ThemedText style={styles.totalText}>Total:</ThemedText>
        <ThemedText style={styles.totalAmount}>₹{orderValue}</ThemedText>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    // backgroundColor: "#f8f8f8",
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
