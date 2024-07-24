import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

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
    <View style={styles.container}>
      <View style={styles.orderItem}>
        <TouchableOpacity
          onPress={() => removeItem(index)}
          style={styles.removeItemButton}
        >
          <Icon name="close" size={30} color="#f00" />
        </TouchableOpacity>
        <View style={styles.itemDetailsContainer}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemPrice}>@ ₹ {item.price.toFixed(2)}</Text>
        </View>
        <View style={styles.quantityContainer}>
          <View style={styles.quantityManipulator}>
            <TouchableOpacity
              onPress={() => decreaseQuantity(index)}
              style={styles.quantityButton}
            >
              <Icon name="remove" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <TouchableOpacity
              onPress={() => increaseQuantity(index)}
              style={styles.quantityButton}
            >
              <Icon name="add" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          <Text style={styles.totalItemPrice}>
            ₹ {(item.price * item.quantity).toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.orderDetails, style]}>
      {orders.length === 0 ? (
        <>
          <Text>No item selected</Text>
          <Text>Please select item from left menu item</Text>
        </>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  orderDetails: {
    padding: 10,
    backgroundColor: "#fff",
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
