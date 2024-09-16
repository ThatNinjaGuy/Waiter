import React, { useState, useCallback } from "react";
import { FlatList, StyleSheet, RefreshControl } from "react-native";
import useResponsiveLayout from "@/hooks/useResponsiveLayout";
import { ThemedView } from "@/components/common/ThemedView";
import { ThemedText } from "@/components/common/ThemedText";
import ThemedButton from "@/components/common/ThemedButton";

const OrdersScreen = ({ orders, updateOrderStatus }) => {
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

  const filteredOrders = orders.filter(
    (order) =>
      !order.status || order.status === "ACTIVE" || order.status === "PENDING"
  );

  const renderOrder = ({ item }) => {
    const buttonConfigs = [];

    if (item.status === "ACTIVE") {
      buttonConfigs.push(
        {
          text: "ACCEPT",
          type: "success",
          onPress: () => updateOrderStatus(item.id, item.tableId, "PENDING"),
        },
        {
          text: "COMPLETE",
          type: "primary",
          onPress: () => updateOrderStatus(item.id, item.tableId, "COMPLETE"),
        }
      );
    } else if (item.status === "PENDING") {
      buttonConfigs.push(
        {
          text: "CANCEL",
          type: "danger",
          onPress: () => updateOrderStatus(item.id, item.tableId, "CANCELLED"),
        },
        {
          text: "COMPLETE",
          type: "success",
          onPress: () => updateOrderStatus(item.id, item.tableId, "COMPLETE"),
        }
      );
    }

    return (
      <ThemedView style={[styles.card, { width: layoutParams.itemWidth }]}>
        <ThemedView style={styles.headerRow}>
          <ThemedView style={styles.infoContainer}>
            <ThemedText style={styles.itemName}>{item.name}</ThemedText>
            <ThemedText style={styles.tableNumber}>
              Qty: {item.quantity}
            </ThemedText>
          </ThemedView>
          <ThemedText style={styles.quantity}>{item.tableNumber}</ThemedText>
        </ThemedView>
        <ThemedText style={styles.notes}>Notes: {item.tableNote}</ThemedText>
        <ThemedView style={styles.buttonContainer}>
          {buttonConfigs.map((config, index) => (
            <ThemedButton
              key={index}
              onPress={config.onPress}
              type={config.type}
              style={styles.completeButton}
            >
              <ThemedText style={styles.completeButtonText}>
                {config.text}
              </ThemedText>
            </ThemedButton>
          ))}
        </ThemedView>
      </ThemedView>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={[{ padding: 5, paddingTop: 10 }]}>
        Pending Orders: {filteredOrders.length}
      </ThemedText>
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
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
  },
  infoContainer: {
    justifyContent: "space-between",
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  quantity: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 50,
    backgroundColor: "#666",
  },
  tableNumber: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  notes: {
    fontSize: 14,
    fontStyle: "italic",
    fontWeight: "bold",
    color: "#666",
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  completeButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 8,
    width: "45%",
    minHeight: 50,
  },
  completeButtonText: {
    fontWeight: "bold",
  },
});

export default OrdersScreen;
