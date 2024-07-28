import React, { useState, useEffect } from "react";
import { StyleSheet, FlatList, Platform } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { ThemedView } from "../common/ThemedView";
import { ThemedText } from "../common/ThemedText";
import ThemedButton from "../common/ThemedButton";

const OrderDetails = ({
  style,
  orders,
  increaseQuantity,
  decreaseQuantity,
  removeItem,
}) => {
  const [orderItems, setOrderItems] = useState(orders);

  useEffect(() => {
    setOrderItems(orders);
  }, [orders]);

  const renderOrderItem = ({ item, index }) => (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.orderItem}>
        <ThemedButton
          onPress={() => removeItem(index)}
          style={styles.removeItemButton}
        >
          <Icon name="close" size={30} color="#f00" />
        </ThemedButton>
        <ThemedView style={styles.itemDetailsContainer}>
          <ThemedText style={styles.itemName}>{item.name}</ThemedText>
          <ThemedText style={styles.itemPrice}>
            @ ₹ {item.price.toFixed(2)}
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.quantityContainer}>
          <ThemedView style={styles.quantityManipulator}>
            <ThemedButton
              onPress={() => decreaseQuantity(index)}
              style={styles.quantityButton}
            >
              <Icon name="remove" size={24} color="#000" />
            </ThemedButton>
            <ThemedText style={styles.quantityText}>{item.quantity}</ThemedText>
            <ThemedButton
              onPress={() => increaseQuantity(index)}
              style={styles.quantityButton}
            >
              <Icon name="add" size={24} color="#000" />
            </ThemedButton>
          </ThemedView>
          <ThemedText style={styles.totalItemPrice}>
            ₹ {(item.price * item.quantity).toFixed(2)}
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );

  return (
    <ThemedView style={[styles.orderDetails, style]}>
      {orders.length === 0 ? (
        <>
          <ThemedText>No item selected</ThemedText>
          <ThemedText>Please select item from left menu item</ThemedText>
        </>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  orderDetails: {
    padding: 10,
    // backgroundColor: "#fff",
    borderLeftWidth: 1,
    borderColor: "#ccc",
  },
  orderItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    ...Platform.select({
      android: {
        // backgroundColor: "red",
        // borderBottomWidth: 5,
      },
      ios: {
        // iOS-specific styles
      },
    }),
  },
  removeItemButton: {
    paddingHorizontal: 5,
    marginRight: 5,
    // backgroundColor: "rgba(168, 133, 138, 0.8)",
    paddingVertical: 10,
    borderRadius: 10,
  },
  itemDetailsContainer: {
    flex: 2,
    justifyContent: "space-between",
    height: "100%",
  },
  itemName: {
    fontSize: 16,
    textAlign: "left",
    alignContent: "center",
    flex: 7,
  },
  itemPrice: {
    fontSize: 14,
    color: "#666",
    textAlign: "left",
    flex: 3,
  },
  quantityContainer: {
    flex: 1,
    justifyContent: "space-between",
    height: "100%",
  },
  quantityManipulator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 7,
  },
  quantityButton: {
    padding: 5,
    backgroundColor: "rgba(201, 81, 98, 0.8)",
    borderRadius: 10,
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  totalItemPrice: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    flex: 3,
  },
});

export default OrderDetails;
