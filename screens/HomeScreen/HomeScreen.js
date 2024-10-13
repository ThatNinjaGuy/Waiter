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
        <RevenueGraphs restaurantPath={restaurantPath} />
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
