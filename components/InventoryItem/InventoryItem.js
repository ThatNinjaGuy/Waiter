import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import styles from "./styles";

const InventoryItem = ({ item, onEdit, onDelete }) => (
  <View style={styles.container}>
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
      {item.key ? <Text style={styles.key}>{item.key}</Text> : <></>}
      <View style={styles.actions}>
        <Pressable onPress={onEdit}>
          <Text style={styles.edit}>Edit</Text>
        </Pressable>
        <Pressable onPress={onDelete}>
          <Text style={styles.delete}>Delete</Text>
        </Pressable>
      </View>
    </View>
  </View>
);

export default InventoryItem;
