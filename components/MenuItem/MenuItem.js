import React, { useState, useCallback } from "react";
import { Image, FlatList, RefreshControl, StyleSheet } from "react-native";
import { ThemedView } from "@/components/common/ThemedView";
import { ThemedText } from "@/components/common/ThemedText";
import ThemedButton from "@/components/common/ThemedButton";
import useResponsiveLayout from "@/hooks/useResponsiveLayout";

const MenuItem = ({ items, onEdit }) => {
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
    const { image, name, cuisine, price, searchableKey } = item;
    return (
      <ThemedButton
        style={[styles.card, { width: layoutParams.itemWidth }]}
        onPress={onEdit}
        type="secondary"
      >
        <Image
          source={{
            uri: image ? image : "https://dummyimage.com/650x450/cc00cc/fff",
          }}
          style={styles.image}
        />
        <ThemedText style={styles.tableDetails}>{name}</ThemedText>
        <ThemedText style={styles.tableDetails}>{cuisine}</ThemedText>
        <ThemedText style={styles.tableDetails}>₹{price}</ThemedText>
        {searchableKey && (
          <ThemedText style={styles.key}>{searchableKey}</ThemedText>
        )}
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
    alignItems: "center",
  },
  card: {
    flex: 1,
    borderColor: "rgba(57, 60, 78, 0.31)",
    borderWidth: 1, // Add a border for definitions
    borderRadius: 8,
    padding: 16,
    margin: 8,
    elevation: 4,
    shadowColor: "#fff", // Add shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  list: {
    flex: 1,
  },
  row: {
    justifyContent: "flex-start",
  },
  tableDetails: {
    fontSize: 14,
    marginBottom: 2,
    lineHeight: 20, // Adjust based on your font size
    flex: 1, // This will make the text expand to fill the container
    color: "black",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 10,
  },
  key: {
    fontSize: 20,
    fontWeight: "bold",
    backgroundColor: "rgba(122, 8, 246, 0.8)",
    color: "#fff",
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
  },
});

export default MenuItem;
