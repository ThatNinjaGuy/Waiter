import React from "react";
import { StyleSheet } from "react-native";
import { ThemedView } from "../common/ThemedView";
import { ThemedText } from "../common/ThemedText";
import ThemedButton from "../common/ThemedButton";

const PaymentOptions = ({ onSave, style, onCancel, completeOrder }) => {
  return (
    <ThemedView style={[styles.paymentOptions, style]}>
      <ThemedButton style={styles.button} onPress={onCancel} type="danger">
        <ThemedText>Cancel</ThemedText>
      </ThemedButton>
      <ThemedButton
        style={styles.button}
        onPress={completeOrder}
        type="primary"
      >
        <ThemedText>Generate Bill</ThemedText>
      </ThemedButton>
      <ThemedButton style={styles.button} onPress={onSave} type="success">
        <ThemedText>KOT</ThemedText>
      </ThemedButton>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  paymentOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
    borderTopWidth: 1,
    borderColor: "#ccc",
    margin: 1,
  },
  button: {
    padding: 10,
    margin: 2,
    borderRadius: 5,
    width: "30%",
  },
});

export default PaymentOptions;
