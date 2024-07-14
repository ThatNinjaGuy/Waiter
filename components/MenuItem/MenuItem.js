import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import styles from "./styles";

const MenuItem = ({ item, onEdit, onDelete }) => (
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
      <Text style={styles.cuisine}>{item.cuisine}</Text>
      <Text style={styles.price}>₹{item.price}</Text>
    </View>
    <View style={styles.actions}>
      <TouchableOpacity onPress={onEdit}>
        <Text style={styles.edit}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onDelete}>
        <Text style={styles.delete}>Delete</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default MenuItem;
