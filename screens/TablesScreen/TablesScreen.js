import React, { useState, useEffect, useContext } from "react";
import { FlatList } from "react-native";
import AddTable from "@/components/Tables/AddTable";
import TableList from "@/components/Tables/TableList";
import TableManagement from "@/components/TableManagement/TableManagement";
import { searchOrder } from "@/utils/searchCriteria";
import styles from "@/screens/common/styles";
import CustomSearchBar from "@/components/common/SearchBar";
import OrderManagement from "@/components/OrderManagement/OrderManagement";
import { ThemedView } from "@/components/common/ThemedView";
import ThemedButton from "@/components/common/ThemedButton";
import { ThemedText } from "@/components/common/ThemedText";
import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";
import AuthContext from "@/components/Authentication/AuthProvider";
import AuthScreen from "@/screens/AuthScreen/AuthScreen";
import { addTable, updateTableDetails } from "@/firebase/queries/tables";
import { fetchMenuItems } from "@/firebase/queries/menuItems";
import { addCompletedOrder } from "@/firebase/queries/completedOrder";
import {
  markOrderAsCompleted,
  getUniqueFilters,
  filterBySelectedFilter,
  handleTableOrderUpdate,
} from "@/utils/tableManagement";
import { getAddTableTranslation } from "@/utils/appText/tablesScreen";
import { sendNotification } from "@/utils/sendNotification";
import { identifyNotificationTokens } from "@/utils/sendNotification";
import { NEW_ORDERS } from "@/constants/notificationControls";

const TablesScreen = () => {
  const { user, hotel, liveTables, staffs, restaurantPath } =
    useContext(AuthContext);
  const preferredLanguage = user?.preferredLanguage;
  const addTableText = getAddTableTranslation(preferredLanguage);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [search, setSearch] = useState("");
  const [filteredItems, setFilteredItems] = useState(liveTables);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [tableAdd, setTableAdd] = useState(false);
  const [tableInfoOptionClicked, setTableInfoOptionClicked] = useState(false);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    setFilteredItems(liveTables);
    refreshSelectedTable();
  }, [liveTables]);

  useEffect(() => {
    // Fetch menu items on the liveTables screen so no refetch is needed for each table
    fetchMenuItems(restaurantPath, setMenuItems, undefined);
  }, []);

  const refreshSelectedTable = () => {
    if (!selectedTable) return;
    const updatedTable = liveTables.find((t) => t.id === selectedTable.id);
    setSelectedTable(updatedTable);
  };

  const addNewTable = (item) => {
    addTable(restaurantPath, [item], liveTables, undefined);
    setTableAdd(false);
  };

  const handleAddItemClick = () => {
    setSelectedTable(null);
    setTableAdd(true);
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
    updatedTable = markOrderAsCompleted(updatedTable, selectedTable, (table) =>
      addCompletedOrder(restaurantPath, table)
    );
    updateTableDetails(
      restaurantPath,
      updatedTable.id,
      updatedTable,
      undefined,
      undefined
    );
    setSelectedTable(null);
    setTableInfoOptionClicked(false);
  };

  const updateSearch = (searchText) => {
    setSearch(searchText);
    setFilteredItems(searchOrder(liveTables, searchText));
  };

  const handleTableInfoClose = () => {
    setSelectedTable(null);
    setTableInfoOptionClicked(false);
    setTableAdd(false);
  };

  const handleCompleteOrder = () => {
    setTableInfoOptionClicked(true);
  };

  const handleUpdateTableOrder = (orders, pendingOrdersCount) => {
    if (pendingOrdersCount > 0) {
      sendNotification(
        "New order recieved",
        `New order for ${pendingOrdersCount} items placed on table ${selectedTable.number}`,
        identifyNotificationTokens(staffs, NEW_ORDERS)
      );
    }
    handleTableOrderUpdate(
      orders,
      liveTables,
      selectedTable,
      undefined,
      updateTableDetails,
      restaurantPath
    );
  };

  if (!user) return <AuthScreen />;

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ThemedView style={styles.mainContainer}>
      {!selectedTable && !tableAdd && (
        <ThemedView style={styles.container}>
          <ThemedButton
            onPress={handleAddItemClick}
            type="primary"
            style={[{ borderRadius: 0, marginBottom: 5 }]}
          >
            <ThemedText>{addTableText}</ThemedText>
          </ThemedButton>
          <TableList
            tables={filteredItems}
            onTablePress={handleTablePress}
            onOrderDetailsPress={handleOrderDetailsPress}
            preferredLanguage={preferredLanguage}
          />
          <ThemedView style={styles.filterListContainer}>
            <FlatList
              horizontal
              data={getUniqueFilters(liveTables)}
              renderItem={({ item }) => (
                <ThemedButton
                  style={[
                    styles.filterButton,
                    selectedFilter === item && styles.selectedFilterButton,
                  ]}
                  onPress={() =>
                    filterBySelectedFilter(
                      item,
                      setSelectedFilter,
                      setFilteredItems,
                      liveTables
                    )
                  }
                  type="secondary"
                >
                  <ThemedText style={styles.filterButtonText}>
                    {item}
                  </ThemedText>
                </ThemedButton>
              )}
              keyExtractor={(item) => item}
              style={styles.filterList}
            />
          </ThemedView>
          <CustomSearchBar searchText={search} updateSearch={updateSearch} />
        </ThemedView>
      )}
      {selectedTable && !tableInfoOptionClicked && (
        <OrderManagement
          items={selectedTable?.orders}
          menuItems={menuItems}
          preferredLanguage={preferredLanguage}
          onClose={() => setSelectedTable(null)}
          updateOrder={handleUpdateTableOrder}
          handleCompleteOrder={handleCompleteOrder}
          style={styles.container}
        />
      )}

      {selectedTable && tableInfoOptionClicked && (
        <ThemedView style={styles.container}>
          <TableManagement
            hotel={hotel}
            table={selectedTable}
            staffs={staffs}
            onUpdateTable={handleUpdateTable}
            onClose={handleTableInfoClose}
          />
        </ThemedView>
      )}

      {tableAdd && (
        <ThemedView style={[{ flex: 1, width: "100%" }]}>
          <AddTable
            onUpdateTable={addNewTable}
            onClose={handleTableInfoClose}
          />
        </ThemedView>
      )}
    </ThemedView>
  );
};

export default TablesScreen;
