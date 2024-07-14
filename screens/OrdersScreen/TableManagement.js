// components/TableManagement.js
import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";

const TableManagement = ({ table, onUpdateTable }) => {
  const [guests, setGuests] = useState(table.guests.toString());
  const [notes, setNotes] = useState(table.notes);

  const handleUpdate = () => {
    onUpdateTable({
      ...table,
      guests: parseInt(guests, 10),
      notes,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Table Management</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Number of Guests:</Text>
        <TextInput
          style={styles.input}
          value={guests}
          onChangeText={setGuests}
          keyboardType="numeric"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Notes:</Text>
        <TextInput
          style={[styles.input, styles.notesInput]}
          value={notes}
          onChangeText={setNotes}
          multiline
        />
      </View>
      <Pressable style={styles.updateButton} onPress={handleUpdate}>
        <Text style={styles.updateButtonText}>Update Table</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
  },
  notesInput: {
    height: 80,
    verticalAlign: "top",
  },
  updateButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 4,
    alignItems: "center",
  },
  updateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default TableManagement;
