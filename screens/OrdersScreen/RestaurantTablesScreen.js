import React, { useState, useEffect } from "react";
import { Text, Button, View, FlatList, Pressable } from "react-native";
import TableList from "./TableList";
import {
  collection,
  getDocs,
  writeBatch,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import OrderDetails from "./OrderDetails";
import TableManagement from "./TableManagement";
import { searchOrder } from "@/screens/common/searchCriteria";
import styles from "@/screens/common/styles";
import CustomSearchBar from "@/screens/common/SearchBar";
import OrderManagement from "@/components/OrderTaking/OrderManagement";

const RestaurantTablesScreen = () => {
  const [tables, setTables] = useState([]);

  const [selectedTable, setSelectedTable] = useState(null);
  const [search, setSearch] = useState("");
  const [filteredItems, setFilteredItems] = useState(tables);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [tableAdd, setTableAdd] = useState(false);
  const [tableInfoOptionClicked, setTableInfoOptionClicked] = useState(false);

  useEffect(() => {
    const fetchAllTables = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "tables/"));
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTables(items);
      } catch (error) {
        console.error("Error fetching tables:", error);
      }
    };

    fetchAllTables();
  }, []);

  useEffect(() => {
    setFilteredItems(tables);
  }, [tables]);

  const addDetailsForTables = async (items) => {
    const batch = writeBatch(db);
    const newItems = [];

    items.forEach((item) => {
      item.number = item.number ? item.number : tables.length + 1;
      item.searchableKey = item.number;
      item.status = "Occupied";
      item.orderCount = 0;
      item.totalOrders = 0;
      const docRef = doc(collection(db, "tables/"));
      batch.set(docRef, item);
      newItems.push({ ...item, id: docRef.id });
    });

    try {
      await batch.commit();
      console.log("Batch write successful");
      setTables([...tables, ...newItems]);
      console.log(newItems);
    } catch (error) {
      console.error("Error writing batch:", error);
    }
  };

  const addDetailsForTable = (item) => {
    addDetailsForTables([item]);
    setTableAdd(false);
  };

  const handleAddItemClick = () => {
    setSelectedTable(null);
    setTableAdd(true);
  };

  const deleteTableDetails = async (id) => {
    try {
      await deleteDoc(doc(db, "tables/", id));
      setTables(tables.filter((item) => item.id !== id));
      console.log("Document successfully deleted!");
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };

  const updateTableDetails = async (id, updatedItem) => {
    try {
      const itemRef = doc(db, "tables/", id);
      await updateDoc(itemRef, updatedItem);
      setTables(
        tables.map((item) =>
          item.id === id ? { ...item, ...updatedItem } : item
        )
      );
      console.log("Document successfully updated!");
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const handleTablePress = (table) => {
    setSelectedTable(table);
    setTableInfoOptionClicked(false);
  };

  const handleOrderDetailsPress = (table) => {
    setSelectedTable(table);
    setTableInfoOptionClicked(true);
  };

  const handleUpdateTable = (updatedTable) => {
    setTables(tables.map((t) => (t.id === updatedTable.id ? updatedTable : t)));
    updateTableDetails(updatedTable.id, updatedTable);
    setSelectedTable(null);
    setTableInfoOptionClicked(false);
  };

  const calculateOrderValue = (orders) => {
    return orders.reduce((total, order) => total + order.itemValue, 0);
  };

  const calculateTotalOrderCount = (orders) => {
    return orders.reduce((total, order) => total + order.quantity, 0);
  };

  const handleTableOrderUpdate = (orders) => {
    const tableIndex = tables.findIndex((t) => t.id === selectedTable.id);
    if (tableIndex !== -1) {
      const updatedTable = { ...tables[tableIndex], orders };
      updatedTable.orderValue = calculateOrderValue(orders);
      updatedTable.totalOrders = calculateTotalOrderCount(orders);
      const newTables = [...tables];
      newTables[tableIndex] = updatedTable;
      setTables(newTables);
      updateTableDetails(selectedTable.id, updatedTable);
    }
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

  const handleTableInfoClose = () => {
    setSelectedTable(null);
    setTableInfoOptionClicked(false);
    setTableAdd(false);
  };

  return (
    <View style={styles.mainContainer}>
      {!selectedTable && !tableAdd && (
        <View style={styles.container}>
          <Button title="Add Table" onPress={handleAddItemClick} />
          <TableList
            tables={filteredItems}
            onTablePress={handleTablePress}
            onOrderDetailsPress={handleOrderDetailsPress}
          />
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
      )}
      {selectedTable && !tableInfoOptionClicked && (
        <OrderManagement
          items={selectedTable?.orders}
          onClose={handleTableInfoClose}
          updateOrder={handleTableOrderUpdate}
          style={styles.container}
        />
      )}

      {selectedTable && tableInfoOptionClicked && (
        <View style={styles.container}>
          <TableManagement
            table={selectedTable}
            onUpdateTable={handleUpdateTable}
            onClose={handleTableInfoClose}
          />
          <OrderDetails order={selectedTable} />
        </View>
      )}

      {tableAdd && (
        <View>
          <TableManagement
            table={selectedTable}
            onUpdateTable={addDetailsForTable}
            onClose={handleTableInfoClose}
          />
        </View>
      )}
    </View>
  );
};

export default RestaurantTablesScreen;
