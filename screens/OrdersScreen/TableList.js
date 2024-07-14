// components/TableList.js
import React from "react";
import {
  FlatList,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";

const TableList = ({ tables, onTablePress }) => {
  const renderTableItem = ({ item }) => (
    <TouchableOpacity
      style={styles.tableItem}
      onPress={() => onTablePress(item)}
    >
      <Text style={styles.tableNumber}>Table {item.number}</Text>
      <Text style={styles.tableStatus}>{item.status}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={tables}
      renderItem={renderTableItem}
      keyExtractor={(item) => item.id.toString()}
      style={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  tableItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  tableNumber: {
    fontSize: 16,
    fontWeight: "bold",
  },
  tableStatus: {
    fontSize: 14,
    color: "#666",
  },
});

export default TableList;
