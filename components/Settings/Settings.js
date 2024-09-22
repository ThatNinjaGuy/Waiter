import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/Ionicons";
import {
  LANGUAGE_MAPPER,
  appDefaultLanguage,
} from "@/constants/appText/common";
import ThemedButton from "@/components/common/ThemedButton";
import { ThemedText } from "@/components/common/ThemedText";
import { Tooltip, Text } from "react-native-elements";
import { updateStaff } from "@/firebase/queries/staffs";
import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";

const SettingsScreen = ({ userDetails, onCancel }) => {
  const [name, setName] = useState(userDetails?.name || "");
  const [age, setAge] = useState(userDetails?.age || "");
  const [email, setEmail] = useState(userDetails?.email || "");
  const [role, setRole] = useState(userDetails?.role || "");
  const [phoneNumber, setPhoneNumber] = useState(userDetails?.mobile || "");
  const [language, setLanguage] = useState(
    userDetails?.preferredLanguage || appDefaultLanguage
  );
  const [notificationSettings, setNotificationSettings] = useState({
    newOrders: false,
    orderReady: false,
    orderCompleted: false,
    newGuests: false,
    ...userDetails?.notificationSettings,
  });
  const [loading, setLoading] = useState(false);
  const [expandedProfileSection, expandProfileSection] = useState(true);
  const [expandedAppSection, expandAppSettingsSection] = useState(false);
  const [expandedNotificationsSection, expandNotificationsSection] =
    useState(false);

  const toggleProfileSection = () =>
    expandProfileSection(!expandedProfileSection);
  const toggleAppSettingsSection = () =>
    expandAppSettingsSection(!expandedAppSection);
  const toggleNotificationSettingsSection = () =>
    expandNotificationsSection(!expandedNotificationsSection);

  const onUpdate = async () => {
    setLoading(true);
    await updateStaff(
      userDetails.id,
      {
        ...userDetails,
        name: name,
        age: age,
        mobile: phoneNumber,
        preferredLanguage: language,
        notificationSettings: notificationSettings,
      },
      undefined,
      setLoading
    );
    onCancel();
  };

  const notificationSettingTypes = [
    {
      displayText: "New Order receivied",
      key: "newOrders",
    },
    {
      displayText: "Order Ready for pickup",
      key: "orderReady",
    },
    {
      displayText: "Order Complete",
      key: "orderCompleted",
    },
    {
      displayText: "New Guest arrived",
      key: "newGuests",
    },
  ];

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Profile Details Section */}
        <TouchableOpacity
          onPress={toggleProfileSection}
          style={styles.sectionHeader}
        >
          <ThemedText style={styles.sectionTitle}>Profile Details</ThemedText>
          <Icon
            name={
              expandedProfileSection
                ? "chevron-down-outline"
                : "chevron-up-outline"
            }
            size={20}
            color="#333"
          />
        </TouchableOpacity>
        {expandedProfileSection && (
          <View style={styles.sectionContent}>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={name}
              onChangeText={setName}
            />
            <Tooltip popover={<Text>Please ontact your manager</Text>}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                editable={false}
              />
            </Tooltip>
            <Tooltip popover={<Text>Please ontact your manager</Text>}>
              <TextInput
                style={styles.input}
                placeholder="Role"
                value={role}
                editable={false}
              />
            </Tooltip>
            <TextInput
              style={styles.input}
              placeholder="Age"
              value={age}
              onChangeText={setAge}
              keyboardType="number-pad"
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="number-pad"
            />
          </View>
        )}

        {/* App Settings Section */}
        <TouchableOpacity
          onPress={toggleAppSettingsSection}
          style={styles.sectionHeader}
        >
          <ThemedText style={styles.sectionTitle}>App Settings</ThemedText>
          <Icon
            name={
              expandedAppSection ? "chevron-down-outline" : "chevron-up-outline"
            }
            size={20}
            color="#333"
          />
        </TouchableOpacity>
        {expandedAppSection && (
          <View style={styles.sectionContent}>
            <View style={styles.row}>
              <ThemedText style={styles.label}>Language</ThemedText>
              <Picker
                selectedValue={language}
                style={styles.picker}
                onValueChange={(itemValue) => setLanguage(itemValue)}
              >
                {Object.entries(LANGUAGE_MAPPER).map(
                  ([key, { displayText }]) => (
                    <Picker.Item key={key} label={displayText} value={key} />
                  )
                )}
              </Picker>
            </View>
          </View>
        )}

        {/* Notification Settings Section */}
        <TouchableOpacity
          onPress={toggleNotificationSettingsSection}
          style={styles.sectionHeader}
        >
          <ThemedText style={styles.sectionTitle}>
            Notification Settings
          </ThemedText>
          <Icon
            name={
              expandedNotificationsSection
                ? "chevron-down-outline"
                : "chevron-up-outline"
            }
            size={20}
            color="#333"
          />
        </TouchableOpacity>
        {expandedNotificationsSection && (
          <View style={styles.sectionContent}>
            {notificationSettingTypes.map((item, index) => (
              <View key={index} style={styles.switchContainer}>
                <ThemedText>{item.displayText}</ThemedText>
                <Switch
                  value={notificationSettings[item.key]}
                  onValueChange={() =>
                    setNotificationSettings((prevSettings) => ({
                      ...prevSettings,
                      [item.key]: !prevSettings[item.key],
                    }))
                  }
                />
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <ThemedButton type="danger" onPress={onCancel}>
            <ThemedText style={styles.buttonText}>Cancel</ThemedText>
          </ThemedButton>
        </View>
        <View style={styles.buttonWrapper}>
          <ThemedButton type="success" onPress={onUpdate}>
            <ThemedText style={styles.buttonText}>Save</ThemedText>
          </ThemedButton>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  scrollView: {
    marginBottom: 60,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  sectionContent: {
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#ddd",
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    borderRadius: 6,
    backgroundColor: "#f5f5f5",
  },
  radioContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between", // Ensures buttons are stretched
  },
  buttonWrapper: {
    flex: 1, // Allows each button to take equal space
    marginHorizontal: 5, // Optional spacing between buttons
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Adjusts spacing between label and picker
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10, // Space between label and picker
  },
  picker: {
    flex: 1, // Ensures picker takes up remaining space
  },
});

export default SettingsScreen;
