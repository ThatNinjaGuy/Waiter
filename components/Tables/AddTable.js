import React from "react";
import { StyleSheet } from "react-native";
import FloatingCloseButton from "@/components/FloatingCloseButton/FloatingCloseButton";
import { ThemedView } from "@/components/common/ThemedView";
import { ThemedText } from "@/components/common/ThemedText";
import ThemedButton from "@/components/common/ThemedButton";

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
    <ThemedView style={styles.container}>
      <FloatingCloseButton onClose={onClose} />
      <ThemedText type="title">Add a table</ThemedText>
      <ThemedButton
        style={styles.updateButton}
        onPress={handleUpdate}
        type="primary"
      >
        <ThemedText type="defaultSemiBold">Add Table</ThemedText>
      </ThemedButton>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    flex: 1,
    marginBottom: 20,
  },
  updateButton: {
    padding: 15,
    borderRadius: 5,
  },
});

export default AddTable;
