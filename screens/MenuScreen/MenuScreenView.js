import React, { useState, useEffect } from "react";
import { View, FlatList } from "react-native";
import Button from "../../components/Button/Button";
import MenuItem from "../../components/MenuItem/MenuItem";
import CustomModal from "../../components/Modal/Modal";
import { searchByNameKey } from "@/screens/common/searchCriteria";
import styles from "@/screens/common/styles";
import CustomSearchBar from "@/screens/common/SearchBar";

const formSchema = [
  { name: "searchableKey", placeholder: "Key", keyboardType: "default" },
  { name: "name", placeholder: "Item Name", keyboardType: "default" },
  { name: "price", placeholder: "Price", keyboardType: "numeric" },
  { name: "cuisine", placeholder: "Cuisine", keyboardType: "default" },
  { name: "image", placeholder: "Image URL", keyboardType: "default" },
];

const MenuScreenView = ({
  menuItems,
  addMenuItem,
  deleteMenuItem,
  updateMenuItem,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [search, setSearch] = useState("");
  const [filteredItems, setFilteredItems] = useState(menuItems);

  useEffect(() => {
    setFilteredItems(menuItems);
  }, [menuItems]);

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
      updateMenuItem(currentItem.id, item);
    } else {
      addMenuItem(item);
    }
    setModalVisible(false);
  };

  const updateSearch = (searchText) => {
    setSearch(searchText);
    setFilteredItems(searchByNameKey(menuItems, searchText));
  };

  return (
    <View style={styles.container}>
      <Button title="Add Item" onPress={handleAddItem} />
      <FlatList
        data={filteredItems}
        renderItem={({ item }) => (
          <MenuItem
            key={item.id}
            item={item}
            onEdit={() => handleEditItem(item)}
            onDelete={() => deleteMenuItem(item.id)}
          />
        )}
      />
      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveItem}
        item={currentItem}
        schema={formSchema}
      />
      <CustomSearchBar searchText={search} updateSearch={updateSearch} />
    </View>
  );
};

export default MenuScreenView;
