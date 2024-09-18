import React, { useState, useContext } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import ApproveSignUpRequestsScreen from "@/components/Authentication/ApproveSignUpRequestsScreen";
import AuthContext from "@/components/Authentication/AuthProvider";
import AuthScreen from "@/components/Authentication/AuthScreen";
import UnauthorizedScreen from "@/components/Authentication/UnauthorizedScreen";
import { DEFAULT_IMAGE } from "@/constants/common";

const ProfileScreen = () => {
  const { width } = Dimensions.get("window");
  const isLargeScreen = width > 768;

  const navigation = useNavigation();
  const { user, logout } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: "John Doe",
    position: "Head Chef",
    email: "john.doe@restaurant.com",
    phone: "+1 234 567 8900",
  });
  const [openApproveRequests, setOpenApproveRequests] = useState(false);

  const navigationOptions = [
    {
      title: "Approve Sign Up Requests",
      icon: "person-add",
      onPress: () => setOpenApproveRequests(true),
    },
    {
      title: "Checkout Menu",
      icon: "restaurant-menu",
      onPress: () => navigation.navigate("menu"),
    },
    {
      title: "Inventory",
      icon: "inventory",
      onPress: () => navigation.navigate("inventory"),
    },
    {
      title: "Employees",
      icon: "people",
      onPress: () => navigation.navigate("staffs"),
    },
    {
      title: "Log Out",
      icon: "exit-to-app",
      onPress: () => logout(),
    },
  ];

  const handleEdit = () => {
    setIsEditing(!isEditing);
    // Implement edit functionality here
  };

  if (!user) return <AuthScreen />;

  if (
    user.staffDetails &&
    !(
      user.staffDetails.role === "Manager" ||
      user.staffDetails.role === "Owner" ||
      !user.staffDetails.role ||
      user.staffDetails.role === ""
    )
  ) {
    return <UnauthorizedScreen />;
  }

  if (openApproveRequests) return <ApproveSignUpRequestsScreen />;

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={["#4c669f", "#3b5998", "#192f6a"]}
        style={{ height: isLargeScreen ? 200 : 300 }}
      >
        <BlurView intensity={80} style={styles.blurContainer}>
          <View
            style={[
              styles.profileContent,
              {
                flexDirection: isLargeScreen ? "row" : "column",
                alignItems: "center",
                justifyContent: isLargeScreen ? "center" : "flex-start", // Add this line
              },
            ]}
          >
            <View>
              <Image
                source={{ uri: DEFAULT_IMAGE }}
                style={[
                  styles.profileImage,
                  {
                    alignSelf: isLargeScreen ? "flex-start" : "center",
                  },
                ]}
              />
            </View>
            <View
              style={[
                styles.userDetails,
                {
                  marginLeft: isLargeScreen ? 20 : 0,
                  alignItems: isLargeScreen ? "flex-start" : "center",
                  justifyContent: "center",
                },
              ]}
            >
              <Text style={styles.name}>{userProfile.name}</Text>
              <Text style={styles.position}>{userProfile.position}</Text>
              <View style={styles.infoContainer}>
                <Icon
                  name="email"
                  size={20}
                  color="#fff"
                  style={styles.infoIcon}
                />
                <Text style={styles.info}>{userProfile.email}</Text>
              </View>
              <View style={styles.infoContainer}>
                <Icon
                  name="phone"
                  size={20}
                  color="#fff"
                  style={styles.infoIcon}
                />
                <Text style={styles.info}>{userProfile.phone}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
              <Icon name="edit" size={isLargeScreen ? 24 : 18} color="#fff" />
            </TouchableOpacity>
          </View>
        </BlurView>
      </LinearGradient>

      <View style={styles.navigationOptions}>
        {navigationOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.optionItem}
            onPress={option.onPress}
          >
            <LinearGradient
              colors={["#FF9966", "#FF5E62"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.optionGradient}
            >
              <Icon name={option.icon} size={24} color="#fff" />
            </LinearGradient>
            <Text style={styles.optionText}>{option.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f3f5",
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
    color: "#fff",
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
