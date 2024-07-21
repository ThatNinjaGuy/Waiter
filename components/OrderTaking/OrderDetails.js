import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
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
    <View style={styles.orderItem}>
      <TouchableOpacity
        onPress={() => removeItem(index)}
        style={styles.removeItemButton}
      >
        <Icon name="close" size={24} color="#f00" />
      </TouchableOpacity>
      <Text style={styles.itemName}>{item.name}</Text>
      <View style={styles.quantityContainer}>
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
      <Text style={styles.itemPrice}>₹ {item?.price?.toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={[styles.orderDetails, style]}>
      {orderItems.length === 0 ? (
        <>
          <Text>No item selected</Text>
          <Text>Please select item from left menu item</Text>
        </>
      ) : (
        <FlatList
          data={orderItems}
          renderItem={renderOrderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
  },
  removeItemButton: {
    marginRight: 10,
  },
  itemName: {
    flex: 1,
    fontSize: 16,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    padding: 5,
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  itemPrice: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default OrderDetails;
