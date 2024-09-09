import FloatingCloseButton from "@/components/FloatingCloseButton/FloatingCloseButton";
import ThemedButton from "@/components/common/ThemedButton";
import { ThemedText } from "@/components/common/ThemedText";
import { ThemedView } from "@/components/common/ThemedView";
import React, { useState } from "react";
import { Modal, FlatList, TextInput, StyleSheet } from "react-native";

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
      <ThemedView style={styles.container}>
        <FloatingCloseButton onClose={onClose} />
        <ThemedText type="title" style={styles.title}>
          Manage Categories
        </ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Category Name"
          value={newCategory}
          onChangeText={setNewCategory}
        />
        <ThemedView style={styles.buttons}>
          <ThemedButton
            type="primary"
            onPress={editingCategory ? handleUpdateCategory : handleAddCategory}
          >
            <ThemedText>
              {editingCategory ? "Update Category" : "Add Category"}
            </ThemedText>
          </ThemedButton>
        </ThemedView>
        <FlatList
          style={{ flex: 1 }}
          data={categories}
          renderItem={({ item }) => (
            <ThemedView style={styles.categoryItem}>
              <ThemedText type="defaultSemiBold">{item}</ThemedText>
              <ThemedView style={styles.categoryActions}>
                <ThemedButton
                  onPress={() => handleDeleteCategory(item)}
                  style={[styles.button, styles.deleteButton]}
                >
                  <ThemedText>Delete</ThemedText>
                </ThemedButton>
                <ThemedButton
                  type="primary"
                  onPress={() => handleEditCategory(item)}
                  style={styles.button}
                >
                  <ThemedText>Edit</ThemedText>
                </ThemedButton>
              </ThemedView>
            </ThemedView>
          )}
          keyExtractor={(item) => item}
        />
      </ThemedView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
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
  button: {
    marginHorizontal: 5,
    width: 75,
  },
  deleteButton: {
    backgroundColor: "#F44336",
  },
});

export default CategoryManagementPopup;
