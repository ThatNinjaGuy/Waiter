import React, { useState, useEffect } from "react";
import { FlatList } from "react-native";
import InventoryItem from "@/components/InventoryItem/InventoryItem";
import CustomModal from "@/components/CustomModal/CustomModal";
import { searchByNameKey } from "@/utils/searchCriteria";
import styles from "@/screens/common/styles";
import CustomSearchBar from "@/components/common/SearchBar";
import { ThemedView } from "@/components/common/ThemedView";
import ThemedButton from "@/components/common/ThemedButton";
import { ThemedText } from "@/components/common/ThemedText";

const formSchema = [
  {
    name: "searchableKey",
    placeholder: "Key",
    inputMode: "default",
    type: "text",
  },
  {
    name: "name",
    placeholder: "Item Name",
    inputMode: "default",
    type: "text",
  },
  {
    name: "price",
    placeholder: "Price",
    inputMode: "numeric",
    type: "text",
  },
  {
    name: "quantity",
    placeholder: "Quantity",
    inputMode: "numeric",
    type: "text",
  },
  {
    name: "unit",
    placeholder: "Unit",
    inputMode: "default",
    type: "dropdown",
    options: ["Kg", "l", "pc", "dozen", "quintal"],
  },
  {
    name: "image",
    placeholder: "Image URL",
    inputMode: "default",
    type: "text",
  },
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
      {modalVisible && (
        <CustomModal
          onClose={() => setModalVisible(false)}
          onSave={handleSaveItem}
          onDelete={handleDeleteItem}
          item={currentItem}
          schema={formSchema}
        />
      )}
      <CustomSearchBar searchText={search} updateSearch={updateSearch} />
    </ThemedView>
  );
};

export default InventoryScreenView;
