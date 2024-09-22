import React, { useState, useContext, useEffect } from "react";
import { Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import AuthContext from "@/components/Authentication/AuthProvider";
import AuthScreen from "@/screens/AuthScreen/AuthScreen";
import ProfileHeader from "@/components/ProfileHeader/ProfileHeader";
import { ThemedView } from "@/components/common/ThemedView";
import {
  getApproveSignupRequestsTranslation,
  getCheckoutMenuTranslation,
  getInventoryTranslation,
  getEmployeesTranslation,
  getLogoutTranslation,
  getSettingsText,
} from "@/utils/appText/profileScreen";
import Settings from "@/components/Settings/Settings";

const ProfileScreen = () => {
  const { user, logout } = useContext(AuthContext);
  const preferredLanguage = user.preferredLanguage;
  const settingsText = getSettingsText(preferredLanguage);
  const approveSignupRequestsText =
    getApproveSignupRequestsTranslation(preferredLanguage);
  const checkoutMenuText = getCheckoutMenuTranslation(preferredLanguage);
  const inventoryText = getInventoryTranslation(preferredLanguage);
  const employeesText = getEmployeesTranslation(preferredLanguage);
  const logoutText = getLogoutTranslation(preferredLanguage);

  const navigation = useNavigation();
  const [userProfile, setUserProfile] = useState({
    name: "John Doe",
    position: "Head Chef",
    email: "john.doe@restaurant.com",
    phone: "+1 234 567 8900",
  });
  const [displaySettingsScreen, openDisplaySettingsScreen] = useState(false);
  const navigationOptions = [
    {
      title: settingsText,
      icon: "person-add",
      visible: true,
      onPress: () => openDisplaySettingsScreen(true),
    },
    {
      title: approveSignupRequestsText,
      icon: "person-add",
      visible:
        user &&
        ((user.staffDetails &&
          (user.staffDetails.role === "Manager" ||
            user.staffDetails.role === "Owner")) ||
          !user.staffDetails),
      onPress: () => navigation.navigate("approve"),
    },
    {
      title: checkoutMenuText,
      icon: "restaurant-menu",
      visible: true,
      onPress: () => navigation.navigate("menu"),
    },
    {
      title: inventoryText,
      icon: "inventory",
      visible: true,
      onPress: () => navigation.navigate("inventory"),
    },
    {
      title: employeesText,
      icon: "people",
      visible: true,
      onPress: () => navigation.navigate("staffs"),
    },
    {
      title: logoutText,
      icon: "exit-to-app",
      visible: true,
      onPress: () => logout(),
    },
  ];

  useEffect(() => {
    if (user && user.staffDetails)
      setUserProfile({
        name: user.staffDetails.name,
        position: user.staffDetails.role,
        email: user.staffDetails.email,
        phone: user.staffDetails.mobile,
      });
  }, [user]);

  if (!user) return <AuthScreen />;

  if (displaySettingsScreen)
    return (
      <Settings
        userDetails={user.staffDetails}
        onCancel={() => openDisplaySettingsScreen(false)}
        onUpdate={() => openDisplaySettingsScreen(false)}
      />
    );

  return (
    <ScrollView style={styles.container}>
      <ProfileHeader
        userProfile={userProfile}
        handleEdit={() => openDisplaySettingsScreen(true)}
      />

      <ThemedView style={styles.navigationOptions}>
        {navigationOptions
          .filter((option) => option.visible)
          .map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionItem}
              onPress={option.onPress}
            >
              <LinearGradient
                colors={["#4c669f", "#192f6a"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.optionGradient}
              >
                <Icon name={option.icon} size={24} color="#fff" />
              </LinearGradient>
              <Text style={styles.optionText}>{option.title}</Text>
            </TouchableOpacity>
          ))}
      </ThemedView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  blurContainer: {
    flex: 1,
    padding: 20,
  },
  profileContent: {
    flex: 1,
    justifyContent: "space-between",
    position: "relative",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#fff",
    marginBottom: 15,
  },
  userDetails: {
    flex: 1,
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  position: {
    fontSize: 18,
    color: "#e0e0e0",
    marginBottom: 15,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoIcon: {
    marginRight: 8,
  },
  info: {
    fontSize: 16,
  },
  editButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
  },
  navigationOptions: {
    padding: 20,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  optionText: {
    fontSize: 18,
    color: "#333",
    fontWeight: "500",
  },
});

export default ProfileScreen;
