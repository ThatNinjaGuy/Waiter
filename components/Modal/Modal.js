import React, { useState, useEffect } from "react";
import { Modal, TextInput } from "react-native";
import styles from "./styles";
import { ThemedView } from "../common/ThemedView";
import ThemedButton from "../common/ThemedButton";
import { ThemedText } from "../common/ThemedText";
import { View } from "react-native-animatable";

const CustomModal = ({ visible, onClose, onSave, onDelete, item, schema }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (item) {
      setFormData(item);
    } else {
      const initialFormData = schema.reduce((acc, field) => {
        acc[field.name] = "";
        return acc;
      }, {});
      setFormData(initialFormData);
    }
  }, [item, schema]);

  const handleInputChange = (name, value) => {
    console.log(`Updating ${name} with value:`, value);
    setFormData((prevData) => {
      const newData = { ...prevData, [name]: value };
      return newData;
    });
  };

  const handleSave = () => {
    onSave(formData);
  };

  const handleDelete = () => {
    onDelete();
  };

  return (
    <Modal
      visible={visible}
      onBackdropPress={onClose}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropTransitionOutTiming={0}
      style={styles.modal}
      transparent={true}
    >
      <View style={styles.modalContent}>
        {schema.map((field) => (
          <TextInput
            key={field.name}
            style={styles.input}
            placeholder={field.placeholder}
            value={formData[field.name]}
            onChangeText={(value) => handleInputChange(field.name, value)}
            keyboardType={field.keyboardType}
          />
        ))}
        <ThemedView style={styles.buttonContainer}>
          <ThemedButton
            style={[styles.button, styles.deleteButton]}
            onPress={handleDelete}
          >
            <ThemedText style={styles.buttonText}>Delete</ThemedText>
          </ThemedButton>
          <ThemedButton
            style={[styles.button, styles.saveButton]}
            onPress={handleSave}
          >
            <ThemedText style={styles.buttonText}>Update</ThemedText>
          </ThemedButton>
        </ThemedView>
        <ThemedView style={styles.buttonContainer}>
          <ThemedButton
            style={[styles.button, styles.cancelButton]}
            onPress={onClose}
          >
            <ThemedText style={styles.buttonText}>Close</ThemedText>
          </ThemedButton>
        </ThemedView>
      </View>
    </Modal>
  );
};

export default CustomModal;
