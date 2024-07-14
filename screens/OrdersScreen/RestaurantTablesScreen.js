import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import TableList from "./TableList";
import OrderDetails from "./OrderDetails";
import TableManagement from "./TableManagement";

const RestaurantTablesScreen = () => {
  const [tables, setTables] = useState([
    { id: 1, number: 1, status: "Occupied", guests: 4, notes: "" },
    { id: 2, number: 2, status: "Available", guests: 0, notes: "" },
    {
      id: 3,
      number: 3,
      status: "Reserved",
      guests: 2,
      notes: "Allergies: Nuts",
    },
  ]);

  const [selectedTable, setSelectedTable] = useState(null);

  const [activeOrder, setActiveOrder] = useState({
    items: [
      { id: 1, name: "Pasta", quantity: 2, price: 12.99 },
      { id: 2, name: "Salad", quantity: 1, price: 8.99 },
    ],
    total: 34.97,
  });

  const handleTablePress = (table) => {
    setSelectedTable(table);
  };

  const handleUpdateTable = (updatedTable) => {
    setTables(tables.map((t) => (t.id === updatedTable.id ? updatedTable : t)));
    setSelectedTable(updatedTable);
  };

  return (
    <ScrollView style={styles.container}>
      <TableList tables={tables} onTablePress={handleTablePress} />
      {selectedTable && (
        <View>
          <OrderDetails order={activeOrder} />
          <TableManagement
            table={selectedTable}
            onUpdateTable={handleUpdateTable}
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default RestaurantTablesScreen;
