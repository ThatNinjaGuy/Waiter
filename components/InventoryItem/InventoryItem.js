import React from "react";
import { View, Image } from "react-native";
import styles from "./styles";
import ThemedButton from "../common/ThemedButton";
import { ThemedText } from "../common/ThemedText";
import { INDIAN_RUPPEE_SYMBOL, DEFAULT_IMAGE } from "@/constants/common";

const InventoryItem = ({ item, onEdit }) => (
  <ThemedButton style={styles.container} onPress={onEdit} type="secondary">
    <Image
      source={{
        uri: item.image ? item.image : DEFAULT_IMAGE,
      }}
      style={styles.image}
    />
    <View style={styles.infoContainer}>
      <ThemedText style={styles.name}>{item.name}</ThemedText>
      <ThemedText style={styles.price}>
        {INDIAN_RUPPEE_SYMBOL}
        {item.price + "/ " + item.unit}
      </ThemedText>
      <ThemedText style={styles.cuisine}>
        {item.quantity + " " + item.unit}
      </ThemedText>
    </View>
    <View style={styles.actionsContainer}>
      {item.searchableKey ? (
        <ThemedText style={styles.key}>{item.searchableKey}</ThemedText>
      ) : (
        <></>
      )}
    </View>
  </ThemedButton>
);

export default InventoryItem;
