import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  Modal,
  FlatList,
  TextInput,
  StyleSheet,
} from "react-native";

const CategoryManagementPopup = ({
  visible,
  onClose,
  categories,
  setCategories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
}) => {
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);

  const handleAddCategory = async () => {
    if (newCategory) {
      await onAddCategory(newCategory);
      setCategories((prevCategories) => [...prevCategories, newCategory]);
      setNewCategory("");
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setNewCategory(category);
  };

  const handleDeleteCategory = async (category) => {
    await onDeleteCategory(category);
    setCategories((prevCategories) =>
      prevCategories.filter((cat) => cat !== category)
    );
  };

  const handleUpdateCategory = async () => {
    if (editingCategory) {
      await onUpdateCategory(editingCategory, newCategory);
      setCategories((prevCategories) =>
        prevCategories.map((cat) =>
          cat === editingCategory ? newCategory : cat
        )
      );
      setEditingCategory(null);
      setNewCategory("");
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <Text style={styles.title}>Manage Categories</Text>
        <TextInput
          style={styles.input}
          placeholder="Category Name"
          value={newCategory}
          onChangeText={setNewCategory}
        />
        <View style={styles.buttons}>
          <Button
            title={editingCategory ? "Update Category" : "Add Category"}
            onPress={editingCategory ? handleUpdateCategory : handleAddCategory}
          />
          <Button title="Cancel" onPress={onClose} />
        </View>
        <FlatList
          data={categories}
          renderItem={({ item }) => (
            <View style={styles.categoryItem}>
              <Text>{item}</Text>
              <View style={styles.categoryActions}>
                <Button title="Edit" onPress={() => handleEditCategory(item)} />
                <Button
                  title="Delete"
                  onPress={() => handleDeleteCategory(item)}
                />
              </View>
            </View>
          )}
          keyExtractor={(item) => item}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: "bold" },
  input: { borderColor: "gray", borderWidth: 1, marginBottom: 10, padding: 8 },
  buttons: { flexDirection: "row", justifyContent: "space-between" },
  categoryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
  },
  categoryActions: { flexDirection: "row" },
});

export default CategoryManagementPopup;
