import React, { useState, useEffect } from "react";
import { View, FlatList } from "react-native";
import Button from "@/components/Button/Button";
import InventoryItem from "@/components/InventoryItem/InventoryItem";
import CustomModal from "@/components/Modal/Modal";
import { searchByNameKey } from "@/screens/common/searchCriteria";
import styles from "@/screens/common/styles";
import CustomSearchBar from "@/screens/common/SearchBar";

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
    <View style={styles.container}>
      <Button title="Add Item" onPress={handleAddItem} />
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
    </View>
  );
};

export default InventoryScreenView;
