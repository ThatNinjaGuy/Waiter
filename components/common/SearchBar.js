import React from "react";
import { SearchBar } from "react-native-elements";
import * as Animatable from "react-native-animatable";
import { StyleSheet } from "react-native";

const CustomSearchBar = ({ searchText, updateSearch }) => {
  return (
    <Animatable.View
      animation="slideInUp"
      duration={500}
      style={styles.searchContainer}
    >
      <SearchBar
        placeholder="Search Here..."
        onChangeText={updateSearch}
        value={searchText}
        containerStyle={styles.searchBar}
        inputContainerStyle={styles.searchInputContainer}
        inputStyle={styles.searchInput}
        round
        lightTheme
      />
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // justifyContent: "center",
    alignItems: "flex-start",
  },
  container: {
    flex: 1,
    paddingBottom: 60,
  },
  itemList: {
    paddingVertical: 10,
  },
  filterListContainer: {
    paddingVertical: 10,
    justifyContent: "center",
    bottom: 0,
  },
  filterList: {
    flexGrow: 0,
  },
  filterButton: {
    padding: 10,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  selectedFilterButton: {
    backgroundColor: "#4CAF50",
  },
  filterButtonText: {
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

export default CustomSearchBar;
