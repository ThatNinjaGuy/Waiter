import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import FloatingCloseButton from "@/components/FloatingCloseButton/FloatingCloseButton";

const AddTable = ({ onUpdateTable, onClose }) => {
  const handleUpdate = () => {
    onUpdateTable({
      guestName: null,
      guestMobile: null,
      guests: null,
      occasion: null,
      bookingTime: null,
      waiter: null,
      notes: null,
    });
  };

  return (
    <View style={styles.container}>
      <FloatingCloseButton onClose={onClose} />
      <Text style={styles.title}>Add a table</Text>
      <Pressable style={styles.updateButton} onPress={handleUpdate}>
        <Text style={styles.updateButtonText}>Add Table</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },

  updateButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  updateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddTable;
