import React from "react";
import { StyleSheet } from "react-native";
import { ThemedView } from "../common/ThemedView";
import { ThemedText } from "../common/ThemedText";
import ThemedButton from "../common/ThemedButton";

const PaymentOptions = ({ onSave, style }) => {
  return (
    <ThemedView style={[styles.paymentOptions, style]}>
      <ThemedButton style={styles.button} onPress={onSave} type="secondary">
        <ThemedText>Save</ThemedText>
      </ThemedButton>
      <ThemedButton style={styles.button} onPress={onSave} type="secondary">
        <ThemedText>Save & Print</ThemedText>
      </ThemedButton>
      <ThemedButton style={styles.button} onPress={onSave} type="secondary">
        <ThemedText>Save & eBill</ThemedText>
      </ThemedButton>
      <ThemedButton style={styles.button} onPress={onSave} type="secondary">
        <ThemedText>KOT</ThemedText>
      </ThemedButton>
      {/* <TouchableOpacity style={styles.button} onPress={onSave}>
        <ThemedText>Hold</ThemedText>
      </TouchableOpacity> */}
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
    minWidth: "15%",
  },
});

export default PaymentOptions;
