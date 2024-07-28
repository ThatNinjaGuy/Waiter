import React, { useMemo, useState, useCallback, useEffect } from "react";
import {
  useWindowDimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
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

  const getStatusColor = (status, orderCount, totalOrders) => {
    if (
      status == "Occupied" &&
      orderCount &&
      totalOrders &&
      totalOrders > 0 &&
      orderCount == totalOrders
    )
      return styles.inProgress;
    else if (
      status == "Occupied" &&
      orderCount &&
      totalOrders &&
      orderCount < totalOrders
    )
      return styles.ordered;
    else if (status == "Occupied" && totalOrders == 0) return styles.sitting;
    else if (status == "Reserved") return styles.reserved;
    else return styles.empty;
  };

  const renderTableItem = ({ item }) => (
    <Pressable
      style={[
        styles.tableItem,
        getStatusColor(item.status, item.orderCount, item.totalOrders),
        { width: layoutParams.itemWidth },
      ]}
      onPress={() => onTablePress(item)}
    >
      <Text style={styles.tableNumber}>Table - {item.number}</Text>
      <View style={styles.tableDetailsContainer}>
        <View style={styles.leftColumn}>
          <Text style={styles.tableDetails}>Guest Name: {item.guestName}</Text>
          <Text style={styles.tableDetails}>
            Guests: {item.guests || 0} pax
          </Text>
          <Text style={styles.tableDetails}>Server: {item.waiter}</Text>
          <Text style={styles.tableDetails}>Notes: {item.notes}</Text>
        </View>
        <View style={styles.rightColumn}>
          <Text style={styles.tableDetails}>
            Orders: {item.orderCount || 0}/{item.totalOrders || 0}
          </Text>
          <Text style={styles.tableDetails}>
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
          </Text>
          <Text style={styles.tableDetails}>
            Bill: ₹ {item.orderValue || 0}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.orderDetailsIcon}
        onPress={() => onOrderDetailsPress(item)}
      >
        <Icon name="receipt" size={36} color="#000" />
      </TouchableOpacity>
    </Pressable>
  );

  return (
    <View style={styles.container}>
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
    </View>
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
    backgroundColor: "#fff",
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
    color: "#333",
    marginBottom: 2,
  },
  ordered: {
    backgroundColor: "#b2fab4", // Light green
  },
  inProgress: {
    backgroundColor: "#fff3b0", // Light yellow
  },
  sitting: {
    backgroundColor: "#ffcccb", // Light red
  },
  reserved: {
    backgroundColor: "#add8e6", // Light blue
  },
  empty: {
    backgroundColor: "#e0e0e0", // Default grey
  },
  orderDetailsIcon: {
    position: "absolute",
    bottom: -18,
    left: 0,
    right: 0,
    alignItems: "center",
  },
});

export default TableList;
