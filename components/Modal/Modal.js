import React, { useState, useEffect } from "react";
import { Modal, View, TextInput, TouchableOpacity, Text } from "react-native";
import styles from "./styles";

const CustomModal = ({ visible, onClose, onSave, item, schema }) => {
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
      console.log("New form data:", newData);
      return newData;
    });
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
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
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;
