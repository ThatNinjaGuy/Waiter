import React from "react";
import { SearchBar } from "react-native-elements";
import styles from "@/screens/common/styles";
import * as Animatable from "react-native-animatable";

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

export default CustomSearchBar;
