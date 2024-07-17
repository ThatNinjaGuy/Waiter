import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 60, // To ensure the FlatList doesn't overlap with the SearchBar
  },
  itemList: {
    paddingVertical: 10,
  },
  filterListContainer: {
    paddingVertical: 10,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  filterList: {
    flexGrow: 0,
  },
  filterButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 5,
  },
  selectedFilterButton: {
    backgroundColor: "#4CAF50",
  },
  filterButtonText: {
    color: "black",
    fontWeight: "bold",
  },
  searchContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  searchBar: {
    backgroundColor: "white",
  },
  searchInputContainer: {},
});
