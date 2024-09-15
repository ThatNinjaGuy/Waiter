import React, { useState, useCallback } from "react";
import {
  Image,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { ThemedView } from "@/components/common/ThemedView";
import { ThemedText } from "@/components/common/ThemedText";
import useResponsiveLayout from "@/hooks/useResponsiveLayout";
import ThemedButton from "@/components/common/ThemedButton";

const MenuItems = ({ items, onEdit }) => {
  const [refreshing, setRefreshing] = useState(false);

  const { layoutParams, key } = useResponsiveLayout({
    initialItemWidth: 300,
    minItemWidth: 250,
    itemMargin: 20,
  });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const renderMenu = ({ item }) => {
    const { image, name, cuisine, price, searchableKey, category, type } = item;
    return (
      <ThemedButton
        style={[styles.card, { width: layoutParams.itemWidth }]}
        onPress={() => onEdit(item)}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: image ? image : "https://dummyimage.com/650x450/cc00cc/fff",
            }}
            style={[styles.image, { width: layoutParams.itemWidth }]}
            resizeMode="cover"
          />
          {searchableKey && (
            <ThemedText style={styles.key}>{searchableKey}</ThemedText>
          )}
        </View>

        <ThemedText style={styles.headerRow}>{name}</ThemedText>
        <View style={styles.contentContainer}>
          <View style={styles.leftColumn}>
            <ThemedText style={styles.contentInfo}>
              Cuisine: {cuisine}
            </ThemedText>
            <ThemedText style={styles.contentInfo}>
              Category: {category}
            </ThemedText>
          </View>
          <View style={styles.rightColumn}>
            <ThemedText style={styles.contentInfo}>Price: {price}</ThemedText>
            <ThemedText style={styles.contentInfo}>Diet: {type}</ThemedText>
          </View>
        </View>
      </ThemedButton>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <FlatList
        key={key} // Force re-render when numColumns changes
        data={items}
        renderItem={renderMenu}
        keyExtractor={(item) => item.id}
        numColumns={layoutParams.numColumns}
        contentContainerStyle={{
          paddingHorizontal: layoutParams.containerPadding,
        }}
        columnWrapperStyle={
          layoutParams.numColumns > 1 ? styles.row : undefined
        }
        style={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    borderColor: "rgba(57, 60, 78, 0.31)",
    borderWidth: 1,
    borderRadius: 8,
    padding: 0,
    margin: 8,
    elevation: 4,
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    alignItems: "flex-start",
  },
  imageContainer: {
    position: "relative",
    borderColor: "rgba(57, 60, 78, 0.31)",
    borderWidth: 1,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    overflow: "hidden", // Ensure contents don't overflow the container
  },
  image: {
    height: 150,
  },
  key: {
    position: "absolute",
    bottom: 5,
    right: 5,
    fontSize: 16,
    fontWeight: "bold",
    backgroundColor: "#000",
    color: "#fff",
    padding: 5,
    paddingHorizontal: 15,
    borderRadius: 50,
  },
  headerRow: {
    paddingHorizontal: 10,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    paddingTop: 10,
  },
  contentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    padding: 10,
  },
  leftColumn: {
    flex: 1,
    alignItems: "flex-start",
  },
  rightColumn: {
    flex: 1,
    alignItems: "flex-end",
  },
  contentInfo: {
    fontSize: 14,
    marginBottom: 2,
  },
});

export default MenuItems;
