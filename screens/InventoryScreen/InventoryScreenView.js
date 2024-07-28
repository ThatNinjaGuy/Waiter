import React, { useState, useEffect } from "react";
import { FlatList } from "react-native";
import InventoryItem from "@/components/InventoryItem/InventoryItem";
import CustomModal from "@/components/Modal/Modal";
import { searchByNameKey } from "@/screens/common/searchCriteria";
import styles from "@/screens/common/styles";
import CustomSearchBar from "@/screens/common/SearchBar";
import { ThemedView } from "@/components/common/ThemedView";
import ThemedButton from "@/components/common/ThemedButton";
import { ThemedText } from "@/components/common/ThemedText";

const formSchema = [
  { name: "searchableKey", placeholder: "Key", keyboardType: "default" },
  { name: "name", placeholder: "Item Name", keyboardType: "default" },
  { name: "price", placeholder: "Price", keyboardType: "numeric" },
  { name: "quantity", placeholder: "Quantity", keyboardType: "numeric" },
  { name: "unit", placeholder: "Unit", keyboardType: "default" },
  { name: "image", placeholder: "Image URL", keyboardType: "default" },
];

const InventoryScreenView = ({
  inventoryItems,
  addInventoryItem,
  deleteInventoryItem,
  updateInventoryItem,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [search, setSearch] = useState("");
  const [filteredItems, setFilteredItems] = useState(inventoryItems);

  useEffect(() => {
    setFilteredItems(inventoryItems);
  }, [inventoryItems]);

  const handleAddItem = () => {
    setCurrentItem(null);
    setModalVisible(true);
  };

  const handleEditItem = (item) => {
    setCurrentItem(item);
    setModalVisible(true);
  };

  const handleSaveItem = (item) => {
    if (currentItem) {
      updateInventoryItem(currentItem.id, item);
    } else {
      addInventoryItem(item);
    }
    setModalVisible(false);
  };

  const handleDeleteItem = () => {
    deleteInventoryItem(currentItem.id);
    setModalVisible(false);
  };

  const updateSearch = (searchText) => {
    setSearch(searchText);
    setFilteredItems(searchByNameKey(inventoryItems, searchText));
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedButton
        onPress={handleAddItem}
        type="primary"
        style={[{ borderRadius: 0, marginBottom: 5 }]}
      >
        <ThemedText>Add Item</ThemedText>
      </ThemedButton>
      <FlatList
        data={filteredItems}
        renderItem={({ item }) => (
          <InventoryItem
            key={item.id}
            item={item}
            onEdit={() => handleEditItem(item)}
          />
        )}
      />
      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveItem}
        onDelete={handleDeleteItem}
        item={currentItem}
        schema={formSchema}
      />
      <CustomSearchBar searchText={search} updateSearch={updateSearch} />
    </ThemedView>
  );
};

export default InventoryScreenView;
