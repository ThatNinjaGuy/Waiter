import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import styles from "./styles";

const StaffItem = ({ item, onEdit }) => (
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
      <Text style={styles.cuisine}>{item.age}</Text>
      <Text style={styles.price}>{item.role}</Text>
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

export default StaffItem;
