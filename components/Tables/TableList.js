import ThemedButton from "@/components/common/ThemedButton";
import { ThemedText } from "@/components/common/ThemedText";
import { ThemedView } from "@/components/common/ThemedView";
import React, { useMemo } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {
  calculateTotalOrderCount,
  completedOrdersCount,
  calculateOrderValue,
} from "@/utils/orderManagement";
import {
  getLightBgColorWithTableStatus,
  getDarkBgColorWithTableStatus,
} from "@/utils/colorPicker";
import useResponsiveLayout from "@/hooks/useResponsiveLayout";
import { INDIAN_RUPPEE_SYMBOL } from "@/constants/common";
import {
  getTableTranslation,
  getGuestTranslation,
  getGuestsTranslation,
  getServerTranslation,
  getOrdersTranslation,
  getBillTranslation,
  getNotesTranslation,
} from "@/utils/appText/tablesScreen";

const TableList = ({
  tables,
  preferredLanguage,
  onTablePress,
  onOrderDetailsPress,
}) => {
  const tableText = getTableTranslation(preferredLanguage);
  const guestText = getGuestTranslation(preferredLanguage);
  const guestsText = getGuestsTranslation(preferredLanguage);
  const serverText = getServerTranslation(preferredLanguage);
  const ordersText = getOrdersTranslation(preferredLanguage);
  const billText = getBillTranslation(preferredLanguage);
  const notesText = getNotesTranslation(preferredLanguage);

  const { layoutParams, key } = useResponsiveLayout({
    initialItemWidth: 300,
    minItemWidth: 250,
    itemMargin: 20,
  });

  // Sort the tables array by item.number
  const sortedTables = useMemo(() => {
    return [...tables].sort((a, b) => a.number - b.number);
  }, [tables]);

  const renderTableItem = ({ item }) => {
    const {
      number,
      guestName,
      guests,
      waiter,
      notes,
      orders,
      status,
      eta,
      ttlo,
    } = item;

    const completedOrders = completedOrdersCount(orders);
    const totalOrders = calculateTotalOrderCount(orders);
    const orderValue = calculateOrderValue(orders);

    const lightBackgroundColor = getLightBgColorWithTableStatus(
      status,
      completedOrders,
      totalOrders
    );
    const darkBackgroundColor = getDarkBgColorWithTableStatus(
      status,
      completedOrders,
      totalOrders
    );

    const tableWaitTime =
      status === "Occupied" && completedOrders < totalOrders
        ? `ETA: ${eta ? Math.floor(eta / 60) : 0}:${
            eta ? String(eta % 60).padStart(2, "0") : ""
          } min`
        : `TTLO: ${ttlo ? Math.floor(ttlo / 60) : 0}:${
            ttlo ? String(ttlo % 60).padStart(2, "0") : ""
          } min`;

    return (
      <ThemedButton
        style={[styles.tableItem, { width: layoutParams.itemWidth }]}
        onPress={() => onTablePress(item)}
        lightBackgroundColor={lightBackgroundColor}
        darkBackgroundColor={darkBackgroundColor}
      >
        <ThemedText style={styles.tableNumber}>
          {tableText} - {number}
        </ThemedText>
        <View style={styles.tableDetailsContainer}>
          <View style={styles.leftColumn}>
            <ThemedText style={styles.tableDetails}>
              {guestText}: {guestName}
            </ThemedText>
            <ThemedText style={styles.tableDetails}>
              {guestsText}: {guests || 0} pax
            </ThemedText>
            <ThemedText style={styles.tableDetails}>
              {serverText}: {waiter}
            </ThemedText>
          </View>
          <View style={styles.rightColumn}>
            <ThemedText style={styles.tableDetails}>
              {ordersText}: {completedOrders}/{totalOrders}
            </ThemedText>
            <ThemedText style={styles.tableDetails}>{tableWaitTime}</ThemedText>
            <ThemedText style={styles.tableDetails}>
              {billText}: {INDIAN_RUPPEE_SYMBOL}
              {orderValue || 0}
            </ThemedText>
          </View>
        </View>
        <View style={styles.notesContainer}>
          <ThemedText style={styles.tableDetails} numberOfLines={2}>
            {notesText}: {notes}
          </ThemedText>
        </View>
        <View style={styles.orderDetailsIcon}>
          <Icon
            name="print"
            size={36}
            onPress={() => onOrderDetailsPress(item)}
            style={styles.iconContainer}
          />
        </View>
      </ThemedButton>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <FlatList
        key={key} // Force re-render when numColumns changes
        data={sortedTables}
        renderItem={renderTableItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={layoutParams.numColumns}
        contentContainerStyle={{
          paddingHorizontal: layoutParams.containerPadding,
        }}
        columnWrapperStyle={
          layoutParams.numColumns > 1 ? styles.row : undefined
        }
        style={styles.list}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  list: {
    flex: 1,
  },
  row: {
    justifyContent: "flex-start",
  },
  tableItem: {
    padding: 20,
    margin: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tableNumber: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "black",
  },
  tableDetailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  leftColumn: {
    flex: 1,
    alignItems: "flex-start",
  },
  rightColumn: {
    flex: 1,
    alignItems: "flex-end",
  },
  tableDetails: {
    fontSize: 14,
    marginBottom: 2,
    lineHeight: 20, // Adjust based on your font size
    flex: 1, // This will make the text expand to fill the container
    color: "black",
  },
  orderDetailsIcon: {
    position: "absolute",
    bottom: -18,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  iconContainer: {
    backgroundColor: "#e0e0e0", // Default
    borderRadius: 20,
  },
  notesContainer: {
    width: "100%",
    marginTop: 10,
    marginBottom: 5,
    height: 40,
  },
});

export default TableList;
