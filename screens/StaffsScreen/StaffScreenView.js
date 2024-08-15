import React, { useState, useEffect } from "react";
import { FlatList } from "react-native";
import StaffItem from "../../components/StaffItem/StaffItem";
import CustomModal from "../../components/CustomModal/CustomModal";
import { searchByNameKey } from "@/screens/common/searchCriteria";
import styles from "@/screens/common/styles";
import CustomSearchBar from "@/screens/common/SearchBar";
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
  { name: "name", placeholder: "Name", inputMode: "default", type: "text" },
  { name: "age", placeholder: "Age", inputMode: "numeric", type: "text" },
  { name: "role", placeholder: "Role", inputMode: "default", type: "text" },
  {
    name: "image",
    placeholder: "Image URL",
    inputMode: "default",
    type: "text",
  },
];

const StaffScreenView = ({ staffs, addStaff, deleteStaff, updateStaff }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [search, setSearch] = useState("");
  const [filteredItems, setFilteredItems] = useState(staffs);
  const [selectedFilter, setSelectedFilter] = useState("All");

  useEffect(() => {
    setFilteredItems(staffs);
  }, [staffs]);

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
      updateStaff(currentItem.id, item);
    } else {
      addStaff(item);
    }
    setModalVisible(false);
  };

  const handleDeleteItem = () => {
    deleteStaff(currentItem.id);
    setModalVisible(false);
  };

  const updateSearch = (searchText) => {
    setSearch(searchText);
    setFilteredItems(searchByNameKey(staffs, searchText));
  };

  const filterBySelectedFilter = (role) => {
    setSelectedFilter(role);
    if (role === "All") {
      setFilteredItems(staffs);
    } else {
      setFilteredItems(staffs.filter((staff) => staff.role === role));
    }
  };

  const getUniqueFilters = () => {
    const roles = staffs?.map((staff) => staff.role);
    return ["All", ...new Set(roles)];
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedButton
        onPress={handleAddItem}
        type="primary"
        style={[{ borderRadius: 0, marginBottom: 5 }]}
      >
        <ThemedText>Add Person</ThemedText>
      </ThemedButton>
      <FlatList
        data={filteredItems}
        renderItem={({ item }) => (
          <StaffItem
            key={item.id}
            item={item}
            onEdit={() => handleEditItem(item)}
          />
        )}
        style={styles.itemList}
      />
      {modalVisible && (
        <CustomModal
          onClose={() => setModalVisible(false)}
          onSave={handleSaveItem}
          onDelete={handleDeleteItem}
          item={currentItem}
          schema={formSchema}
          style={styles.container}
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

export default StaffScreenView;
