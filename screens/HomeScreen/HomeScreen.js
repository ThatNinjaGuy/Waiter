import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { ThemedText } from "@/components/common/ThemedText";
import { ThemedView } from "@/components/common/ThemedView";
import UserProfile from "@/components/UserProfile";
import Notifications from "@/components/Notifications/Notifications";
import Overview from "@/components/Overview";
import NavigationMenu from "@/components/NavigationMenu/NavigationMenu";
import { useNavigation } from "@react-navigation/native";
import { fetchHotelData } from "@/firebase/queries";

export default function HomeScreen() {
  const navigation = useNavigation();

  const [hotel, setHotel] = useState();
  const [notifications, setNotifications] = useState([]);
  const [overviewItems, setOverviewItems] = useState([]);
  useEffect(() => {
    const fetchHotelDetails = async () => {
      const hotelDetails = await fetchHotelData();
      if (hotelDetails) {
        setHotel(hotelDetails[0]);
        setNotifications(hotelDetails[1].notifications || []);
        setOverviewItems(hotelDetails[1].overviewItems || []);
      }
    };
    fetchHotelDetails();
  }, []);

  const navigationItems = [
    { title: "Menu", onPress: () => navigation.navigate("menu") },
    { title: "Orders", onPress: () => navigation.navigate("orders") },
    { title: "Staffs", onPress: () => navigation.navigate("staffs") },
    { title: "Inventory", onPress: () => navigation.navigate("inventory") },
  ];

  const renderHeader = () => (
    <View>
      <ThemedView style={styles.container}>
        {hotel && (
          <UserProfile
            name={hotel?.name + " ( " + hotel?.owner + " )"}
            role={
              hotel?.city +
              ", " +
              hotel?.state +
              ", " +
              hotel?.country +
              "- " +
              hotel?.pinCode
            }
            plan={hotel?.category}
          />
        )}
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
        <NavigationMenu items={navigationItems} />
      </ThemedView>
    </View>
  );

  return (
    <FlatList
      data={[]} // empty data array since we only need the header component
      ListHeaderComponent={renderHeader}
      keyExtractor={(item, index) => index.toString()}
      renderItem={null}
    />
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
