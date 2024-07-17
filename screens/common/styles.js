import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 60, // To ensure the FlatList doesn't overlap with the SearchBar
  },
  searchContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  searchBar: {
    backgroundColor: "white",
  },
  searchInputContainer: {
    backgroundColor: "#e9e9e9",
  },
});
