import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Icon } from "react-native-elements";

const HeaderSection = () => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity style={styles.dropdown}>
        <Text style={styles.dropdownText}>Categories</Text>
        <Icon name="chevron-down" type="font-awesome" color="#fff" />
      </TouchableOpacity>
      <View style={styles.searchInputContainers}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Item"
          placeholderTextColor="#ccc"
        />
        <TextInput
          style={styles.shortCodeInput}
          placeholder="Short Code"
          placeholderTextColor="#ccc"
        />
      </View>
      <View style={styles.orderManagementContainer}>
        <TouchableOpacity
          style={[styles.orderTypeButton, styles.selectedOrderTypeButton]}
        >
          <Text style={styles.orderTypeText}>Dine In</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.orderTypeButton}>
          <Text style={styles.orderTypeText}>Delivery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.orderTypeButton}>
          <Text style={styles.orderTypeText}>Pick Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000",
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(29, 61, 201, 0.8)",
    paddingHorizontal: 10,
    paddingVertical: 20,
    width: "10%",
  },
  dropdownText: {
    color: "#fff",
    marginRight: 5,
    fontSize: 18,
    fontWeight: "bold",
  },
  searchInputContainers: {
    width: "45%",
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 5,
    justifyContent: "space-between",
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 10,
    paddingVertical: 20,
    marginHorizontal: 5,
    borderRadius: 5,
    fontSize: 18,
  },
  shortCodeInput: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 10,
    paddingVertical: 20,
    marginHorizontal: 5,
    borderRadius: 5,
    fontSize: 18,
  },
  orderManagementContainer: {
    width: "45%",
    flexDirection: "row",
  },
  orderTypeButton: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 40,
    alignItems: "center",
    borderColor: "#fff",
    borderWidth: 1,
  },
  selectedOrderTypeButton: {
    backgroundColor: "#d9534f",
  },
  orderTypeText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default HeaderSection;
