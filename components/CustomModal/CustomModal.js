import React, { useState, useEffect } from "react";
import { Modal, TextInput, View } from "react-native";
import { Picker } from "@react-native-picker/picker"; // Import Picker for dropdown
import { RadioButton } from "react-native-paper"; // Import RadioButton for radio inputs
import styles from "./styles";
import { ThemedView } from "../common/ThemedView";
import ThemedButton from "../common/ThemedButton";
import { ThemedText } from "../common/ThemedText";

const CustomModal = ({ onClose, onSave, onDelete, item, schema }) => {
  const initializeFormData = (schema, item) => {
    return schema.reduce((acc, field) => {
      acc[field.name] = item ? item[field.name] : "";
      return acc;
    }, {});
  };

  const [formData, setFormData] = useState(() =>
    initializeFormData(schema, item)
  );

  useEffect(() => {
    setFormData(initializeFormData(schema, item));
  }, [item, schema]);

  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  const handleDelete = () => {
    onDelete();
  };

  return (
    <Modal
      key={item ? item.id : "new"} // Unique key based on item
      onBackdropPress={onClose}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropTransitionOutTiming={0}
      style={styles.modal}
      transparent={true}
    >
      <View style={styles.modalContent}>
        {schema.map((field) => {
          switch (field.type) {
            case "dropdown":
              return (
                <Picker
                  key={field.name}
                  selectedValue={formData[field.name] || ""} // Default to unselected
                  onValueChange={(value) =>
                    handleInputChange(field.name, value)
                  }
                  style={styles.dropdown}
                >
                  <Picker.Item label="Select an option" value="" />
                  {field.options.map((option) => (
                    <Picker.Item key={option} label={option} value={option} />
                  ))}
                </Picker>
              );
            case "radio":
              return (
                <View key={field.name} style={styles.radioGroup}>
                  <ThemedText>{field.placeholder}</ThemedText>
                  {field.options.map((option) => (
                    <View key={option} style={styles.radioItem}>
                      <RadioButton
                        value={option}
                        status={
                          formData[field.name] === option
                            ? "checked"
                            : "unchecked"
                        }
                        onPress={() => handleInputChange(field.name, option)}
                      />
                      <ThemedText>{option}</ThemedText>
                    </View>
                  ))}
                </View>
              );
            default:
              return (
                <TextInput
                  key={field.name}
                  style={styles.input}
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChangeText={(value) => handleInputChange(field.name, value)}
                  keyboardType={field.inputMode}
                />
              );
          }
        })}
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
