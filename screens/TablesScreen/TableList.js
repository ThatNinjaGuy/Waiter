import ThemedButton from "@/components/common/ThemedButton";
import { ThemedText } from "@/components/common/ThemedText";
import { ThemedView } from "@/components/common/ThemedView";
import React, { useMemo, useState, useCallback, useEffect } from "react";
import { useWindowDimensions, FlatList, StyleSheet, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const TableList = ({ tables, onTablePress, onOrderDetailsPress }) => {
  const { width } = useWindowDimensions();
  const [layoutParams, setLayoutParams] = useState({
    itemWidth: 300,
    numColumns: 1,
    containerPadding: 0,
  });
  const [key, setKey] = useState(0);

  const calculateLayout = useCallback(() => {
    let itemWidth = 300; // Initial fixed width for each item
    const itemMargin = 20;
    const numColumns = Math.max(
      1,
      Math.floor((width - itemMargin) / (itemWidth + itemMargin))
    );
    let containerPadding = (width - numColumns * (itemWidth + itemMargin)) / 2;

    if (containerPadding > itemMargin) {
      itemWidth += (containerPadding - itemMargin) / numColumns;
      containerPadding = itemMargin;
    }

    return { itemWidth, numColumns, containerPadding };
  }, [width]);

  useEffect(() => {
    const newLayoutParams = calculateLayout();
    setLayoutParams(newLayoutParams);
    setKey((prevKey) => prevKey + 1); // Update key to force re-render
  }, [calculateLayout]);

  // Sort the tables array by item.number
  const sortedTables = useMemo(() => {
    return [...tables].sort((a, b) => a.number - b.number);
  }, [tables]);

  const getDarkBackgroundColor = (status, orderCount, totalOrders) => {
    if (
      status == "Occupied" &&
      orderCount &&
      totalOrders &&
      totalOrders > 0 &&
      orderCount == totalOrders
    )
      return "rgba(142, 149, 38, 0.8)";
    else if (
      status == "Occupied" &&
      orderCount &&
      totalOrders &&
      orderCount < totalOrders
    )
      return "rgba(38, 149, 59, 0.8)";
    else if (status == "Occupied" && totalOrders == 0)
      return "rgba(144, 38, 149, 0.8)";
    else if (status == "Reserved") return "rgba(38, 38, 149, 0.8)";
    else return "rgba(95, 95, 123, 0.8)";
  };

  const getLightBackgroundColor = (status, orderCount, totalOrders) => {
    if (
      status == "Occupied" &&
      orderCount &&
      totalOrders &&
      totalOrders > 0 &&
      orderCount == totalOrders
    )
      return "rgba(142, 149, 38, 0.8)";
    else if (
      status == "Occupied" &&
      orderCount &&
      totalOrders &&
      orderCount < totalOrders
    )
      return "rgba(38, 149, 59, 0.8)";
    else if (status == "Occupied" && totalOrders == 0) return "#fff";
    else if (status == "Reserved") return "rgba(38, 38, 149, 0.8)";
    else return "rgba(95, 95, 123, 0.8)";
  };

  const renderTableItem = ({ item }) => (
    <ThemedButton
      style={[styles.tableItem, { width: layoutParams.itemWidth }]}
      onPress={() => onTablePress(item)}
      lightBackgroundColor={getLightBackgroundColor(
        item.status,
        item.orderCount,
        item.totalOrders
      )}
      darkBackgroundColor={getDarkBackgroundColor(
        item.status,
        item.orderCount,
        item.totalOrders
      )}
    >
      <ThemedText style={styles.tableNumber}>Table - {item.number}</ThemedText>
      <View style={styles.tableDetailsContainer}>
        <View style={styles.leftColumn}>
          <ThemedText style={styles.tableDetails}>
            Guest Name: {item.guestName}
          </ThemedText>
          <ThemedText style={styles.tableDetails}>
            Guests: {item.guests || 0} pax
          </ThemedText>
          <ThemedText style={styles.tableDetails}>
            Server: {item.waiter}
          </ThemedText>
          <ThemedText style={styles.tableDetails}>
            Notes: {item.notes}
          </ThemedText>
        </View>
        <View style={styles.rightColumn}>
          <ThemedText style={styles.tableDetails}>
            Orders: {item.orderCount || 0}/{item.totalOrders || 0}
          </ThemedText>
          <ThemedText style={styles.tableDetails}>
            {item.status === "Occupied" &&
            item.orderCount &&
            item.totalOrders &&
            item.orderCount < item.totalOrders
              ? `ETA: ${item.eta ? Math.floor(item.eta / 60) : 0}${
                  item.eta ? ":" : ""
                }${item.eta ? String(item.eta % 60).padStart(2, "0") : ""} min`
              : `TTLO: ${item.ttlo ? Math.floor(item.ttlo / 60) : 0}${
                  item.ttlo ? ":" : ""
                }${
                  item.ttlo ? String(item.ttlo % 60).padStart(2, "0") : ""
                } min`}
          </ThemedText>
          <ThemedText style={styles.tableDetails}>
            Bill: ₹ {item.orderValue || 0}
          </ThemedText>
        </View>
      </View>
      <View style={styles.orderDetailsIcon}>
        <Icon
          name="receipt"
          size={36}
          onPress={() => onOrderDetailsPress(item)}
          style={styles.iconContainer}
        />
      </View>
    </ThemedButton>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        key={key} // Force re-render when numColumns changes
        data={sortedTables}
        renderItem={renderTableItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={layoutParams.numColumns}
        contentContainerStyle={{
          paddingHorizontal: layoutParams.containerPadding,
        }}
        columnWrapperStyle={
          layoutParams.numColumns > 1 ? styles.row : undefined
        }
        style={styles.list}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  list: {
    flex: 1,
  },
  row: {
    justifyContent: "flex-start",
  },
  tableItem: {
    padding: 20,
    margin: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tableNumber: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  tableDetailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  leftColumn: {
    flex: 1,
    alignItems: "flex-start",
  },
  rightColumn: {
    flex: 1,
    alignItems: "flex-end",
  },
  tableDetails: {
    fontSize: 14,
    marginBottom: 2,
  },
  ordered: {
    backgroundColor: "rgba(38, 149, 59, 0.8)", // Light green
  },
  inProgress: {
    backgroundColor: "rgba(142, 149, 38, 0.8)", // Light yellow
  },
  sitting: {
    backgroundColor: "rgba(144, 38, 149, 0.8)", // Light red
  },
  reserved: {
    backgroundColor: "rgba(38, 38, 149, 0.8)", // Light blue
  },
  empty: {
    backgroundColor: "rgba(95, 95, 123, 0.8)", // Default grey
  },
  orderDetailsIcon: {
    position: "absolute",
    bottom: -18,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  iconContainer: {
    backgroundColor: "#e0e0e0", // Default
  },
});

export default TableList;
