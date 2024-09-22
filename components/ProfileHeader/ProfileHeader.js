import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import Icon from "react-native-vector-icons/MaterialIcons";
import { DEFAULT_IMAGE } from "@/constants/common";

const ProfileHeader = ({ userProfile, handleEdit }) => {
  const { width } = Dimensions.get("window");
  const isLargeScreen = width > 768;

  return (
    <LinearGradient
      colors={["#4c669f", "#3b5998", "#192f6a"]}
      // colors={["#FFB733", "#FFAE19", "#ffa500"]}
      style={{
        height: isLargeScreen ? 200 : 300,
      }}
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
            {userProfile.position && (
              <Text style={styles.position}>{userProfile.position}</Text>
            )}
            {userProfile.email && (
              <View style={styles.infoContainer}>
                <Icon
                  name="email"
                  size={20}
                  color="#fff"
                  style={styles.infoIcon}
                />
                <Text style={styles.info}>{userProfile.email}</Text>
              </View>
            )}
            {userProfile.address && (
              <View style={styles.infoContainer}>
                <Icon
                  name="location-pin"
                  size={20}
                  color="#fff"
                  style={styles.infoIcon}
                />
                <Text style={styles.info}>{userProfile.address}</Text>
              </View>
            )}
            {userProfile.phone && (
              <View style={styles.infoContainer}>
                <Icon
                  name="phone"
                  size={20}
                  color="#fff"
                  style={styles.infoIcon}
                />
                <Text style={styles.info}>{userProfile.phone}</Text>
              </View>
            )}
          </View>
          {handleEdit && handleEdit != null && (
            <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
              <Icon name="edit" size={isLargeScreen ? 24 : 18} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </BlurView>
    </LinearGradient>
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

export default ProfileHeader;
