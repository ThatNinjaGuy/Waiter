import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import styles from "./styles";

const InventoryItem = ({ item, onEdit }) => (
  <Pressable style={styles.container} onPress={onEdit}>
    <Image
      source={{
        uri: item.image
          ? item.image
          : "https://dummyimage.com/650x450/cc00cc/fff",
      }}
      style={styles.image}
    />
    <View style={styles.infoContainer}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>₹{item.price + " /" + item.unit}</Text>
      <Text style={styles.cuisine}>{item.quantity + " " + item.unit}</Text>
    </View>
    <View style={styles.actionsContainer}>
      {item.searchableKey ? (
        <Text style={styles.key}>{item.searchableKey}</Text>
      ) : (
        <></>
      )}
    </View>
  </Pressable>
);

export default InventoryItem;
