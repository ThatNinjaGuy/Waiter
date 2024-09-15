import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet } from "react-native";
import MenuItems from "@/components/MenuItems/MenuItems";
import CustomModal from "@/components/CustomModal/CustomModal";
import { searchByNameKey } from "@/utils/searchCriteria";
import styles from "@/screens/common/styles";
import CustomSearchBar from "@/components/common/SearchBar";
import { ThemedView } from "@/components/common/ThemedView";
import { ThemedText } from "@/components/common/ThemedText";
import { ThemedButton } from "@/components/common/ThemedButton";
import CategoryManagementPopup from "@/components/CategoryManagementPopup/CategoryManagementPopup";
import { menuItemFormSchema } from "@/constants/formSchema";

const MenuScreenView = ({
  menuItems,
  addMenuItem,
  deleteMenuItem,
  updateMenuItem,
  categories,
  setCategories,
  handleAddMenuItemCategory,
  handleUpdateMenuItemCategory,
  handleDeleteMenuItemCategory,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [search, setSearch] = useState("");
  const [filteredItems, setFilteredItems] = useState(menuItems);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [isPopupVisible, setPopupVisible] = useState(false);

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
      <ThemedView style={buttonStyles.buttonContainer}>
        <ThemedButton
          onPress={() => setPopupVisible(true)}
          type="primary"
          style={buttonStyles.button}
        >
          <ThemedText>Update Menu Category</ThemedText>
        </ThemedButton>
        <ThemedButton
          onPress={handleAddItem}
          type="primary"
          style={buttonStyles.button}
        >
          <ThemedText>Add Menu Item</ThemedText>
        </ThemedButton>
      </ThemedView>
      <MenuItems items={filteredItems} onEdit={handleEditItem} />
      <CategoryManagementPopup
        visible={isPopupVisible}
        onClose={() => setPopupVisible(false)}
        categories={categories}
        setCategories={setCategories}
        onAddCategory={handleAddMenuItemCategory}
        onUpdateCategory={handleUpdateMenuItemCategory}
        onDeleteCategory={handleDeleteMenuItemCategory}
      />
      {modalVisible && (
        <CustomModal
          onClose={() => setModalVisible(false)}
          onSave={handleSaveItem}
          onDelete={handleDeleteItem}
          item={currentItem}
          schema={menuItemFormSchema(categories)}
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

const buttonStyles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    borderRadius: 5,
    marginBottom: 5,
    marginHorizontal: 2,
  },
});

export default MenuScreenView;
