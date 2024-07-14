import React, { useState } from "react";
import { View, FlatList } from "react-native";
import Button from "../../components/Button/Button";
import MenuItem from "../../components/MenuItem/MenuItem";
import CustomModal from "../../components/Modal/Modal";
import styles from "./styles";

const formSchema = [
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

  return (
    <View style={styles.container}>
      <Button title="Add Item" onPress={handleAddItem} />
      <FlatList
        data={menuItems}
        renderItem={({ item }) => (
          <MenuItem
            key={item.id}
            item={item}
            onEdit={() => handleEditItem(item)}
            onDelete={() => deleteMenuItem(item.id)}
          />
        )}
        keyExtractor={(item) => item.id}
      />
      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveItem}
        item={currentItem}
        schema={formSchema}
      />
    </View>
  );
};

export default MenuScreenView;
