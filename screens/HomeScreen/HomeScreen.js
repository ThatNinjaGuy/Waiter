import React from "react";
import { StyleSheet, View } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { ThemedText } from "@/components/common/ThemedText";
import { ThemedView } from "@/components/common/ThemedView";
import UserProfile from "@/components/UserProfile";
import Notifications from "@/components/common/Notifications";
import Overview from "@/components/Overview";
import NavigationMenu from "@/components/common/NavigationMenu";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const navigation = useNavigation();

  const notifications = [
    { id: 1, message: "New order received" },
    { id: 2, message: "Staff meeting at 3 PM" },
    { id: 3, message: "Inventory running low on tomatoes" },
  ];

  const overviewItems = [
    { id: 1, title: "Revenue", message: "₹1,234" },
    { id: 2, title: "Orders", message: "56" },
    { id: 3, title: "Reservations", message: "12" },
    { id: 4, title: "Low Inventory", message: "34" },
    { id: 5, title: "Staff In", message: "80%" },
    { id: 6, title: "Orders Today", message: "20" },
  ];

  const navigationItems = [
    { title: "Menu", onPress: () => navigation.navigate("menu") },
    { title: "Orders", onPress: () => navigation.navigate("orders") },
    { title: "Staffs", onPress: () => navigation.navigate("staffs") },
    { title: "Inventory", onPress: () => navigation.navigate("inventory") },
  ];

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.section}>
        <View style={styles.titleContainer}>
          <ThemedText style={styles.title} type="title" setBackground={true}>
            Today's Overview
          </ThemedText>
        </View>
        <Overview overviewItems={overviewItems} />
      </ThemedView>
      <ThemedView style={styles.section}>
        <View style={styles.titleContainer}>
          <ThemedText style={styles.title} type="title" setBackground={true}>
            Notifications
          </ThemedText>
        </View>
        <Notifications notifications={notifications} />
      </ThemedView>

      {/* <ThemedView style={styles.section}>
        <ThemedText style={styles.title} type="title">
          Quick Actions
        </ThemedText> */}
      <NavigationMenu items={navigationItems} />
      {/* </ThemedView> */}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: "2%",
  },
  headerForeground: {
    height: hp("15%"),
    paddingLeft: wp("2%"),
    justifyContent: "center",
    backgroundColor: "rgba(14, 16, 231, 0.8)",
  },
  sectionTitle: {
    fontSize: wp("4%"),
    marginBottom: hp("2%"),
  },
  section: {
    borderWidth: 0.5,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 16,
    margin: 16,
  },
  titleContainer: {
    position: "absolute",
    top: -12,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  title: {
    // backgroundColor: "rgba(0, 0, 0, 0.8)",
    paddingHorizontal: 8,
  },
});
