import React, { useState, useEffect } from "react";
import { FlatList } from "react-native";
import MenuItem from "../../components/MenuItem/MenuItem";
import CustomModal from "../../components/CustomModal/CustomModal";
import { searchByNameKey } from "@/screens/common/searchCriteria";
import styles from "@/screens/common/styles";
import CustomSearchBar from "@/screens/common/SearchBar";
import { ThemedView } from "@/components/common/ThemedView";
import { ThemedText } from "@/components/common/ThemedText";
import { ThemedButton } from "@/components/common/ThemedButton";

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
    name: "type",
    placeholder: "Type",
    inputMode: "default",
    type: "dropdown",
    options: ["Veg", "Non-Veg", "Vegan"],
  },
  {
    name: "isAvailable",
    placeholder: "Is Available?",
    inputMode: "default",
    type: "radio",
    options: ["Yes", "No"],
  },
  {
    name: "category",
    placeholder: "Category",
    inputMode: "default",
    type: "dropdown",
    options: [
      "Beverages",
      "Burgers",
      "EGG",
      "Chicken",
      "Chakhna",
      "Chinese Snacks",
      "Chinese Soups",
      "Garlic Bread",
      "Gravy Items",
      "Hawaiian Wraps",
      "Maggie Lover",
    ],
  },
  { name: "price", placeholder: "Price", inputMode: "numeric", type: "text" },
  {
    name: "cuisine",
    placeholder: "Cuisine",
    inputMode: "default",
    type: "dropdown",
    options: ["Italian", "Chinese", "Indian"],
  },
  {
    name: "image",
    placeholder: "Image URL",
    inputMode: "default",
    type: "text",
  },
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
  const [selectedFilter, setSelectedFilter] = useState("All");

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

  const handleDeleteItem = () => {
    deleteMenuItem(currentItem.id);
    setModalVisible(false);
  };

  const updateSearch = (searchText) => {
    setSearch(searchText);
    setFilteredItems(searchByNameKey(menuItems, searchText));
  };

  const filterBySelectedFilter = (cuisine) => {
    setSelectedFilter(cuisine);
    if (cuisine === "All") {
      setFilteredItems(menuItems);
    } else {
      setFilteredItems(menuItems.filter((item) => item.cuisine === cuisine));
    }
  };

  const getUniqueFilters = () => {
    const roles = menuItems?.map((item) => item.cuisine);
    return ["All", ...new Set(roles)];
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedButton
        onPress={handleAddItem}
        type="primary"
        style={[{ borderRadius: 0, marginBottom: 5 }]}
      >
        <ThemedText>Add Menu</ThemedText>
      </ThemedButton>
      <FlatList
        data={filteredItems}
        renderItem={({ item }) => (
          <MenuItem
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
      <ThemedView style={styles.filterListContainer}>
        <FlatList
          horizontal
          data={getUniqueFilters()}
          renderItem={({ item }) => (
            <ThemedButton
              style={[
                styles.filterButton,
                selectedFilter === item && styles.selectedFilterButton,
              ]}
              onPress={() => filterBySelectedFilter(item)}
              type="secondary"
            >
              <ThemedText style={styles.filterButtonText}>{item}</ThemedText>
            </ThemedButton>
          )}
          keyExtractor={(item) => item}
          style={styles.filterList}
        />
      </ThemedView>
      <CustomSearchBar searchText={search} updateSearch={updateSearch} />
    </ThemedView>
  );
};

export default MenuScreenView;
