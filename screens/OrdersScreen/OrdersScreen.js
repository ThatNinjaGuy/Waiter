import React, { useState, useCallback } from "react";
import { FlatList, StyleSheet, Pressable, RefreshControl } from "react-native";
import useResponsiveLayout from "@/hooks/useResponsiveLayout";
import { ThemedView } from "@/components/common/ThemedView";
import { ThemedText } from "@/components/common/ThemedText";
import ThemedButton from "@/components/common/ThemedButton";

const OrdersScreen = ({ orders, onCompleteOrder }) => {
  const [refreshing, setRefreshing] = useState(false);

  const { layoutParams, key } = useResponsiveLayout({
    initialItemWidth: 300,
    minItemWidth: 250,
    itemMargin: 20,
  });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const renderOrder = ({ item }) => (
    <ThemedView style={[styles.card, { width: layoutParams.itemWidth }]}>
      <ThemedView style={styles.headerRow}>
        <ThemedText style={styles.itemName}>{item.name}</ThemedText>
        <ThemedText style={styles.quantity}>{item.tableNumber}</ThemedText>
      </ThemedView>
      <ThemedText style={styles.tableNumber}>Qty: {item.quantity}</ThemedText>
      <ThemedText style={styles.notes}>Notes: {item.tableNote}</ThemedText>
      <ThemedButton
        onPress={() => onCompleteOrder(item.id, item.tableId)}
        style={styles.completeButton}
      >
        <ThemedText style={styles.completeButtonText}>
          Complete Order
        </ThemedText>
      </ThemedButton>
    </ThemedView>
  );
  const filteredOrders = orders.filter(
    (order) => !order.status || order.status === "ACTIVE"
  );

  return (
    <ThemedView style={{ flex: 1 }}>
      <FlatList
        key={key} // Force re-render when numColumns changes
        data={filteredOrders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id}
        numColumns={layoutParams.numColumns}
        contentContainerStyle={{
          paddingHorizontal: layoutParams.containerPadding,
        }}
        columnWrapperStyle={
          layoutParams.numColumns > 1 ? styles.row : undefined
        }
        style={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  listContent: {
    padding: 8,
  },
  card: {
    flex: 1,
    borderColor: "rgba(57, 60, 78, 0.31)",
    borderWidth: 1, // Add a border for definitions
    borderRadius: 8,
    padding: 16,
    margin: 8,
    elevation: 4,
    shadowColor: "#fff", // Add shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
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
