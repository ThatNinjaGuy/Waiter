import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import { ThemedText } from "@/components/common/ThemedText";
import { ThemedView } from "@/components/common/ThemedView";
import Overview from "@/components/RestaurantOverview/Overview";
import NavigationMenu from "@/components/NavigationMenu/NavigationMenu";
import { useNavigation } from "@react-navigation/native";
import AuthScreen from "@/screens/AuthScreen/AuthScreen";
import AuthContext from "@/components/Authentication/AuthProvider";
import ProfileHeader from "@/components/ProfileHeader/ProfileHeader";
import RevenueGraphs from "@/components/RevenueGraphs/RevenueGraphs";
import {
  getStaffsTranslation,
  getTablesTranslation,
  getMenuTranslation,
  getOrdersTranslation,
  getInventoryTranslation,
  getProfileTranslation,
  getOverviewTranslation,
} from "@/utils/appText/homeScreen";
import { fetchCompletedOrders } from "@/firebase/queries/completedOrder";

export default function HomeScreen() {
  const { user, hotel, restaurantPath } = useContext(AuthContext);
  const preferredLanguage = user?.preferredLanguage;

  const STAFFS = getStaffsTranslation(preferredLanguage);
  const TABLES = getTablesTranslation(preferredLanguage);
  const MENU = getMenuTranslation(preferredLanguage);
  const ORDERS = getOrdersTranslation(preferredLanguage);
  const INVENTORY = getInventoryTranslation(preferredLanguage);
  const PROFILE = getProfileTranslation(preferredLanguage);
  const TODAY_OVERVIEW = getOverviewTranslation(preferredLanguage);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [weeklyRevenue, setWeeklyRevenue] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);

  useEffect(() => {
    fetchCompletedOrders(restaurantPath, setCompletedOrders);
  }, []);

  useEffect(() => {
    if (completedOrders.length > 0) {
      setWeeklyRevenue(processWeeklyRevenue(completedOrders));
      setMonthlyRevenue(processMonthlyRevenue(completedOrders));
    }
  }, [completedOrders]);

  const processWeeklyRevenue = (orders) => {
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const weeklyData = Array(4).fill(0);

    orders.forEach((order) => {
      const orderDate = new Date(order.bookingTime.seconds * 1000);
      if (orderDate >= oneMonthAgo) {
        const weekIndex = Math.floor(
          (now - orderDate) / (7 * 24 * 60 * 60 * 1000)
        );
        if (weekIndex < 4) {
          weeklyData[weekIndex] += order.orderValue;
        }
      }
    });

    return weeklyData
      .map((value, index) => ({
        name: `Week ${4 - index}`,
        revenue: value,
      }))
      .reverse();
  };

  const processMonthlyRevenue = (orders) => {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const monthlyData = Array(6).fill(0);

    orders.forEach((order) => {
      const orderDate = new Date(order.bookingTime.seconds * 1000);
      if (orderDate >= sixMonthsAgo) {
        const monthIndex = (now.getMonth() - orderDate.getMonth() + 12) % 12;
        if (monthIndex < 6) {
          monthlyData[monthIndex] += order.orderValue;
        }
      }
    });

    return monthlyData
      .map((value, index) => ({
        name: `Month ${6 - index}`,
        revenue: value,
      }))
      .reverse();
  };

  const navigation = useNavigation();

  const navigationItems = [
    { title: STAFFS, onPress: () => navigation.navigate("staffs") },
    { title: TABLES, onPress: () => navigation.navigate("tables") },
    { title: MENU, onPress: () => navigation.navigate("menu") },
    { title: ORDERS, onPress: () => navigation.navigate("orders") },
    { title: INVENTORY, onPress: () => navigation.navigate("inventory") },
    { title: PROFILE, onPress: () => navigation.navigate("profile") },
  ];

  const renderHeader = () => (
    <View>
      <ThemedView style={styles.container}>
        <ProfileHeader
          userProfile={{
            name: hotel?.name,
            address:
              (hotel?.city ? hotel?.city + ", " : "") +
              (hotel?.state ? hotel?.state + ", " : "") +
              (hotel?.country ? hotel?.country + " - " : "") +
              (hotel?.pinCode || ""),
            position: hotel?.owner,
            plan: hotel?.categorys,
          }}
        />
        <ThemedView style={styles.section}>
          <View style={styles.titleContainer}>
            <ThemedText style={styles.title} type="title" setBackground={true}>
              {TODAY_OVERVIEW}
            </ThemedText>
          </View>
          <Overview preferredLanguage={preferredLanguage} />
        </ThemedView>
        <NavigationMenu items={navigationItems} />
        <RevenueGraphs
          weeklyRevenue={weeklyRevenue}
          monthlyRevenue={monthlyRevenue}
        />
      </ThemedView>
    </View>
  );

  if (!user) return <AuthScreen />;

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
