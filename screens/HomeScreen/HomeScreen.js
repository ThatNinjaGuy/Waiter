import React from "react";
import { StyleSheet, ScrollView } from "react-native";
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
    <ScrollView style={styles.scrollView}>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.headerForeground}>
          <UserProfile
            name="John Doe"
            role="Restaurant Manager"
            imageUrl="https://dummyimage.com/650x450/cc00cc/fff"
          />
        </ThemedView>
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle} type="title">
            Today's Overview
          </ThemedText>
          <Overview overviewItems={overviewItems} />
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle} type="title">
            Notifications
          </ThemedText>
          <Notifications notifications={notifications} />
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle} type="title">
            Quick Actions
          </ThemedText>
          <NavigationMenu items={navigationItems} />
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: wp("5%"),
  },
  headerForeground: {
    height: hp("15%"),
    marginTop: hp("2%"),
    paddingLeft: wp("2%"),
    marginBottom: hp("2%"),
    justifyContent: "center",
    backgroundColor: "rgba(170, 183, 225, 0.5)",
    borderRadius: wp("1%"),
  },
  section: {
    marginBottom: hp("2%"),
    marginTop: hp("2%"),
  },
  sectionTitle: {
    fontSize: wp("4%"),
    marginBottom: hp("2%"),
  },
});
