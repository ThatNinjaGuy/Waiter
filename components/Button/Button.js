import React from "react";
import { Pressable, Text } from "react-native";
import styles from "./styles";

const Button = ({ title, onPress }) => (
  <Pressable style={styles.button} onPress={onPress}>
    <Text style={styles.buttonText}>{title}</Text>
  </Pressable>
);

export default Button;
