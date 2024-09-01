import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  RefreshControl,
  Dimensions,
} from "react-native";

const OrdersScreen = ({ orders, onCompleteOrder }) => {
  const [refreshing, setRefreshing] = useState(false);

  const calculateNumColumns = () => {
    const screenWidth = Dimensions.get("window").width;
    return Math.floor(screenWidth / 250); // Adjust 250 to fit your design
  };
  const [numColumns, setNumColumns] = useState(calculateNumColumns());

  useEffect(() => {
    const updateLayout = () => {
      setNumColumns(calculateNumColumns());
    };

    const subscription = Dimensions.addEventListener("change", updateLayout);
    return () => subscription?.remove();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const renderOrder = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.quantity}>{item.tableNumber}</Text>
      </View>
      <Text style={styles.tableNumber}>Qty: {item.quantity}</Text>
      <Text style={styles.notes}>Notes: {item.tableNote}</Text>
      <Pressable
        style={styles.completeButton}
        onPress={() => onCompleteOrder(item.id, item.tableId)}
      >
        <Text style={styles.completeButtonText}>Complete Order</Text>
      </Pressable>
    </View>
  );
  const filteredOrders = orders.filter(
    (order) => !order.status || order.status === "ACTIVE"
  );
  return (
    <FlatList
      data={filteredOrders}
      renderItem={renderOrder}
      keyExtractor={(item, index) => `order-${index}-${item.id}`}
      contentContainerStyle={styles.listContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      numColumns={numColumns}
      key={numColumns} // Force re-render when numColumns changes
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    padding: 8,
  },
  card: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    margin: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    maxWidth: "100%",
    minWidth: 200,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  quantity: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4a90e2",
  },
  tableNumber: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  notes: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#666",
    marginBottom: 8,
  },
  completeButton: {
    backgroundColor: "#4a90e2",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 8,
  },
  completeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default OrdersScreen;
