import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const PaymentOptions = ({ onSave, style }) => {
  return (
    <View style={[styles.paymentOptions, style]}>
      <TouchableOpacity style={styles.button} onPress={onSave}>
        <Text>Save</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={onSave}>
        <Text>Save & Print</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={onSave}>
        <Text>Save & eBill</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={onSave}>
        <Text>KOT</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={onSave}>
        <Text>Hold</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  paymentOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  button: {
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
  },
});

export default PaymentOptions;
