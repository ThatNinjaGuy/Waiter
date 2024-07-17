import React, { useState } from "react";
import { Text, View, FlatList, Pressable } from "react-native";
import TableList from "./TableList";
import OrderDetails from "./OrderDetails";
import TableManagement from "./TableManagement";
import { searchOrder } from "@/screens/common/searchCriteria";
import styles from "@/screens/common/styles";
import CustomSearchBar from "@/screens/common/SearchBar";

const RestaurantTablesScreen = () => {
  const [tables, setTables] = useState([
    {
      id: 1,
      number: 1,
      status: "Occupied",
      guests: 4,
      notes: "",
      orderCount: 13,
      totalOrders: 15,
      orderValue: 3345,
      waiter: "Vishal",
    },
    { id: 2, number: 2, status: "Available" },
    {
      id: 3,
      number: 3,
      status: "Reserved",
      guests: 2,
      notes: "Allergies: Nuts",
    },
    {
      id: 4,
      number: 4,
      status: "Occupied",
      guests: 2,
      notes: "Allergies: Nuts",
      orderCount: 15,
      totalOrders: 15,
      orderValue: 1345,
      waiter: "Vishal G",
    },
    {
      id: 5,
      number: 5,
      status: "Occupied",
      guests: 2,
      notes: "Allergies: Nuts",
      orderCount: 0,
      totalOrders: 0,
      orderValue: 0,
      waiter: "Vishal Gautam",
    },
    { id: 6, number: 6, status: "Available" },
    { id: 7, number: 7, status: "Available" },
    { id: 8, number: 8, status: "Available" },
    { id: 9, number: 9, status: "Available" },
  ]);

  const [selectedTable, setSelectedTable] = useState(null);
  const [search, setSearch] = useState("");
  const [filteredItems, setFilteredItems] = useState(tables);
  const [selectedFilter, setSelectedFilter] = useState("All");

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
    setFilteredItems(
      tables.map((t) => (t.id === updatedTable.id ? updatedTable : t))
    );
    setSelectedTable(updatedTable);
  };

  const updateSearch = (searchText) => {
    setSearch(searchText);
    setFilteredItems(searchOrder(tables, searchText));
  };

  const filterBySelectedFilter = (status) => {
    setSelectedFilter(status);
    if (status === "All") {
      setFilteredItems(tables);
    } else {
      setFilteredItems(tables.filter((item) => item.status === status));
    }
  };

  const getUniqueFilters = () => {
    const roles = tables?.map((item) => item.status);
    return ["All", ...new Set(roles)];
  };

  return (
    <View style={styles.container}>
      <TableList tables={filteredItems} onTablePress={handleTablePress} />
      {selectedTable && (
        <View>
          <OrderDetails order={activeOrder} />
          <TableManagement
            table={selectedTable}
            onUpdateTable={handleUpdateTable}
          />
        </View>
      )}

      <View style={styles.filterListContainer}>
        <FlatList
          horizontal
          data={getUniqueFilters()}
          renderItem={({ item }) => (
            <Pressable
              style={[
                styles.filterButton,
                selectedFilter === item && styles.selectedFilterButton,
              ]}
              onPress={() => filterBySelectedFilter(item)}
            >
              <Text style={styles.filterButtonText}>{item}</Text>
            </Pressable>
          )}
          keyExtractor={(item) => item}
          style={styles.filterList}
        />
      </View>
      <CustomSearchBar searchText={search} updateSearch={updateSearch} />
    </View>
  );
};

export default RestaurantTablesScreen;
