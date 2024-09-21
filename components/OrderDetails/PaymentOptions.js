import React from "react";
import { StyleSheet } from "react-native";
import { ThemedView } from "../common/ThemedView";
import { ThemedText } from "../common/ThemedText";
import ThemedButton from "../common/ThemedButton";
import {
  getCancelTranslation,
  getGenerateBillTranslation,
  getKOTTranslation,
} from "@/utils/appText/orderManagement";

const PaymentOptions = ({
  preferredLanguage,
  onSave,
  style,
  onCancel,
  completeOrder,
}) => {
  const cancelText = getCancelTranslation(preferredLanguage);
  const generateBillText = getGenerateBillTranslation(preferredLanguage);
  const kotText = getKOTTranslation(preferredLanguage);

  return (
    <ThemedView style={[styles.paymentOptions, style]}>
      <ThemedButton style={styles.button} onPress={onCancel} type="danger">
        <ThemedText>{cancelText}</ThemedText>
      </ThemedButton>
      <ThemedButton
        style={styles.button}
        onPress={completeOrder}
        type="primary"
      >
        <ThemedText>{generateBillText}</ThemedText>
      </ThemedButton>
      <ThemedButton style={styles.button} onPress={onSave} type="success">
        <ThemedText>{kotText}</ThemedText>
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
