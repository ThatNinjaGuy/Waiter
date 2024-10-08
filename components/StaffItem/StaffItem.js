import React from "react";
import { View, Image } from "react-native";
import styles from "./styles";
import ThemedButton from "../common/ThemedButton";
import { ThemedText } from "../common/ThemedText";
import { DEFAULT_IMAGE } from "@/constants/common";

const StaffItem = ({ item, onEdit }) => (
  <ThemedButton style={styles.container} onPress={onEdit} type="secondary">
    <Image
      source={{
        uri: item.image ? item.image : DEFAULT_IMAGE,
      }}
      style={styles.image}
    />
    <View style={styles.infoContainer}>
      <ThemedText style={styles.name}>{item.name}</ThemedText>
      <ThemedText style={styles.cuisine}>{item.age}</ThemedText>
      <ThemedText style={styles.price}>{item.role}</ThemedText>
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

export default StaffItem;
