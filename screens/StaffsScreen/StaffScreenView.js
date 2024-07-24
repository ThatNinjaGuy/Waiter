import React, { useState, useEffect } from "react";
import { Text, View, FlatList, Pressable } from "react-native";
import Button from "../../components/Button/Button";
import StaffItem from "../../components/StaffItem/StaffItem";
import CustomModal from "../../components/Modal/Modal";
import { searchByNameKey } from "@/screens/common/searchCriteria";
import styles from "@/screens/common/styles";
import CustomSearchBar from "@/screens/common/SearchBar";

const formSchema = [
  { name: "searchableKey", placeholder: "Key", keyboardType: "default" },
  { name: "name", placeholder: "Name", keyboardType: "default" },
  { name: "age", placeholder: "Age", keyboardType: "numeric" },
  { name: "role", placeholder: "Role", keyboardType: "default" },
  { name: "image", placeholder: "Image URL", keyboardType: "default" },
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
    <View style={styles.container}>
      <Button title="Add Person" onPress={handleAddItem} />
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
      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveItem}
        onDelete={handleDeleteItem}
        item={currentItem}
        schema={formSchema}
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
  );
};

export default StaffScreenView;
