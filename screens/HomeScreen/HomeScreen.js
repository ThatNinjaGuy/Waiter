import React, { useEffect, useState, useContext } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { ThemedText } from "@/components/common/ThemedText";
import { ThemedView } from "@/components/common/ThemedView";
import NotificationsPanel from "@/components/Notifications/NotificationsPanel";
import Overview from "@/components/RestaurantOverview/Overview";
import NavigationMenu from "@/components/NavigationMenu/NavigationMenu";
import { useNavigation } from "@react-navigation/native";
import { fetchHotelData } from "@/firebase/queries";
import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";
import AuthScreen from "@/components/Authentication/AuthScreen";
import AuthContext from "@/components/Authentication/AuthProvider";
import ProfileHeader from "@/components/ProfileHeader/ProfileHeader";

export default function HomeScreen() {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [hotel, setHotel] = useState();
  // const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchHotelDetails = async () => {
      const hotelDetailsArray = await fetchHotelData();
      if (hotelDetailsArray) {
        // Convert array to an object
        const hotelDetails = hotelDetailsArray.reduce((acc, item) => {
          acc[item.id] = item;
          return acc;
        }, {});

        // Access details using keys
        setHotel(hotelDetails["details"]);
        // setNotifications(hotelDetails["homeScreenItems"]?.notifications || []);
        setIsLoading(false);
      }
    };

    setIsLoading(true);
    fetchHotelDetails();
  }, []);

  const navigationItems = [
    { title: "Staffs", onPress: () => navigation.navigate("staffs") },
    { title: "Tables", onPress: () => navigation.navigate("tables") },
    { title: "Menu", onPress: () => navigation.navigate("menu") },
    { title: "Orders", onPress: () => navigation.navigate("orders") },
    { title: "Inventory", onPress: () => navigation.navigate("inventory") },
    { title: "Admin", onPress: () => navigation.navigate("admin") },
  ];

  const renderHeader = () => (
    <View>
      <ThemedView style={styles.container}>
        {hotel && (
          <ProfileHeader
            userProfile={{
              name: hotel.name,
              address:
                hotel.city +
                ", " +
                hotel.state +
                ", " +
                hotel.country +
                "- " +
                hotel.pinCode,
              position: hotel.owner,
              plan: hotel.categorys,
            }}
          />
        )}
        <ThemedView style={styles.section}>
          <View style={styles.titleContainer}>
            <ThemedText style={styles.title} type="title" setBackground={true}>
              Today's Overview
            </ThemedText>
          </View>
          <Overview />
        </ThemedView>
        {/* <ThemedView style={styles.section}>
          <View style={styles.titleContainer}>
            <ThemedText style={styles.title} type="title" setBackground={true}>
              Notifications
            </ThemedText>
          </View>
          <NotificationsPanel notifications={notifications} />
        </ThemedView> */}
        <NavigationMenu items={navigationItems} />
      </ThemedView>
    </View>
  );

  const { user } = useContext(AuthContext);
  if (!user) return <AuthScreen />;

  if (isLoading) {
    <LoadingScreen />;
  }

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
    marginTop: 40,
  },
  titleContainer: {
    position: "absolute",
    top: -12,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  title: {
    paddingHorizontal: 8,
  },
});
