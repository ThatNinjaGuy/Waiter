import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

const TableList = ({ tables, onTablePress }) => {
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
      ]}
      onPress={() => onTablePress(item)}
    >
      <View style={styles.tableInfo}>
        <Text style={styles.tableNumber}>Table - {item.number}</Text>
        <Text style={styles.tableDetails}>
          Orders: {item.orderCount ? item.orderCount : 0}/
          {item.totalOrders ? item.totalOrders : 0}
        </Text>
        {/* ETA for orders in kitchen, and Time to last order for people sitting but no order in kitchen */}
        <Text style={styles.tableDetails}>
          {item.status === "Occupied" &&
          item.orderCount &&
          item.totalOrders &&
          item.orderCount < item.totalOrders
            ? `ETA: ${item.eta ? item.eta / 60 : 0}${item.eta ? ":" : ""}${
                item.eta ? item.eta % 60 : ""
              } min`
            : `TTLO: ${item.ttlo ? item.ttlo / 60 : 0}${item.ttlo ? ":" : ""}${
                item.ttlo ? item.ttlo % 60 : ""
              } min`}
        </Text>
        <Text style={styles.tableDetails}>
          Bill: ₹ {item.orderValue ? item.orderValue : 0}
        </Text>
        <Text style={styles.tableDetails}>
          Guests: {item.guests ? item.guests : 0} pax
        </Text>
        <Text style={styles.tableDetails}>Server: {item.waiter}</Text>
        <Text style={styles.tableDetails}>Notes: {item.notes}</Text>
      </View>
    </Pressable>
  );

  return (
    <FlatList
      data={tables}
      renderItem={renderTableItem}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      columnWrapperStyle={styles.row}
      style={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    margin: 10,
  },
  row: {
    flex: 1,
    justifyContent: "space-around",
  },
  tableItem: {
    flex: 1,
    padding: 16,
    margin: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
  },
  tableInfo: {
    alignItems: "center",
  },
  tableNumber: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  tableDetails: {
    fontSize: 14,
    color: "#333",
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
  default: {
    backgroundColor: "#e0e0e0", // Default grey
  },
});

export default TableList;
