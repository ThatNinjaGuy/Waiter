import { StyleSheet, FlatList, Platform } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { ThemedView } from "../common/ThemedView";
import { ThemedText } from "../common/ThemedText";
import ThemedButton from "../common/ThemedButton";
import { generateUUID } from "@/utils/uuidGenerator";
import { INDIAN_RUPPEE_SYMBOL } from "@/constants/common";
import { ORDER_STATUS } from "@/constants/status/orders";

const OrderDetails = ({
  style,
  orders,
  increaseQuantity,
  decreaseQuantity,
}) => {
  const handleIncreaseQuantityClick = (item) => {
    const orderItem = {
      id: generateUUID(),
      menuItemId: item.menuItemId,
      name: item.name,
      category: item.category,
      cuisine: item.cuisine,
      price: item.price,
      searchableKey: item.searchableKey,
      dietaryPreference: item.dietaryPreference,
      image: item.image,
      quantity: 1,
      status: ORDER_STATUS.ACTIVE,
      itemValue: parseFloat(item.price) || 0, // Convert price to a number,
      orderTimestamp: Date.now(),
    };
    increaseQuantity(orderItem);
  };

  const renderOrderItem = ({ item }) => (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.orderItem}>
        <ThemedView style={styles.itemDetailsContainer}>
          <ThemedText style={styles.itemName}>{item.name}</ThemedText>
          <ThemedText style={styles.itemPrice}>
            @ {INDIAN_RUPPEE_SYMBOL}
            {item.price}
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.quantityContainer}>
          <ThemedView style={styles.quantityManipulator}>
            <ThemedButton
              onPress={() => decreaseQuantity(item)}
              style={styles.quantityButton}
            >
              <Icon name="remove" size={24} color="#000" />
            </ThemedButton>
            <ThemedText style={styles.quantityText}>{item.quantity}</ThemedText>
            <ThemedButton
              onPress={() => handleIncreaseQuantityClick(item)}
              style={styles.quantityButton}
            >
              <Icon name="add" size={24} color="#000" />
            </ThemedButton>
          </ThemedView>
          <ThemedText style={styles.totalItemPrice}>
            {INDIAN_RUPPEE_SYMBOL}
            {(item.price * item.quantity).toFixed(2)}
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );

  return (
    <ThemedView style={[styles.orderDetails, style]}>
      {!orders || orders.length === 0 ? (
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
