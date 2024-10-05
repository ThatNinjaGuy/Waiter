import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, StyleSheet, Alert } from "react-native";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import { firebaseConfig } from "@/firebase/firebaseConfig";
import {
  getApproveSignupRequestsTranslation,
  getNoPendingSignupRequestsTranslation,
  getEmailAlreadyInUseTranslation,
  getPasswordLengthErrorTranslation,
  getSignupErrorTranslation,
  getSuccessTranslation,
  getRequestApprovedSuccessTranslation,
  getFailedToApproveRequestTranslation,
} from "@/utils/appText/profileScreen";
import AuthContext from "@/components/Authentication/AuthProvider";
import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";
import ThemedButton from "../common/ThemedButton";
import { appDefaultLanguage } from "@/constants/appText/common";
import {
  fetchAllSignupRequests,
  deleteSignupRequest,
  addToStaffs,
} from "@/firebase/queries/staffs";

const ApproveSignUpRequestsScreen = () => {
  const { user } = useContext(AuthContext);
  const preferredLanguage = user.preferredLanguage;
  const approveSignupRequestsText =
    getApproveSignupRequestsTranslation(preferredLanguage);
  const noPendingSignupRequestsText =
    getNoPendingSignupRequestsTranslation(preferredLanguage);
  const emailAlreadyInUseText =
    getEmailAlreadyInUseTranslation(preferredLanguage);
  const passwordLengthErrorText =
    getPasswordLengthErrorTranslation(preferredLanguage);
  const signupErrorText = getSignupErrorTranslation(preferredLanguage);
  const successText = getSuccessTranslation(preferredLanguage);
  const requestApprovedSuccessText =
    getRequestApprovedSuccessTranslation(preferredLanguage);
  const failedToApproveRequestText =
    getFailedToApproveRequestTranslation(preferredLanguage);

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  // Create a secondary app for user creation
  const secondaryApp = initializeApp(firebaseConfig, "Secondary");

  useEffect(() => {
    fetchAllSignupRequests(setRequests, setLoading);
  }, []);

  const handleSignUp = async ({ email, password }) => {
    try {
      // Get auth from the secondary app
      const secondaryAuth = getAuth(secondaryApp);
      // Create the user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        email,
        password
      );
      // Immediately sign out the user from the secondary app
      await signOut(secondaryAuth);
      return userCredential.user.uid;
      // You can navigate to the next screen or update UI here
    } catch (error) {
      console.error(error);
      if (error.code === "auth/email-already-in-use") {
        throw new Error(emailAlreadyInUseText);
      } else if (error.code === "auth/weak-password") {
        throw new Error(passwordLengthErrorText);
      } else {
        throw new Error(signupErrorText);
      }
    }
  };

  const deleteRequest = async ({ id }) => {
    try {
      deleteSignupRequest(id);
      console.log("Document successfully deleted!");
    } catch (error) {
      console.error("Error removing document: ", error);
      throw error;
    }
  };

  const handleApprove = async (id) => {
    const request = requests.find((item) => item.id === id);
    try {
      setLoading(true);
      request.authId = await handleSignUp(request);
      addToStaffs(request, appDefaultLanguage);
      deleteRequest(request);
      console.log("Approval requests updated");
      Alert.alert(successText, requestApprovedSuccessText);
    } catch (error) {
      console.error("Error in handleApprove:", error);
      Alert.alert(failedToApproveRequestText, error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.requestItem}>
      <View style={styles.requestInfo}>
        <Text style={styles.requestName}>{item.name}</Text>
        <Text style={styles.requestEmail}>{item.email}</Text>
      </View>
      <ThemedButton
        type="success"
        style={(styles.approveGradient, styles.approveButton)}
        onPress={() => handleApprove(item.id)}
      >
        <Ionicons name="checkmark-outline" size={24} color="#000" />
      </ThemedButton>
    </View>
  );

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{approveSignupRequestsText}</Text>
      {requests.length === 0 ? (
        <Text style={styles.noRequestsText}>{noPendingSignupRequestsText}</Text>
      ) : (
        <FlatList
          data={requests}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: 20,
  },
  requestItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  requestInfo: {
    flex: 1,
  },
  requestName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  requestEmail: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  approveButton: {
    marginLeft: 10,
  },
  approveGradient: {
    borderRadius: 20,
    padding: 10,
  },
  noRequestsText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
});

export default ApproveSignUpRequestsScreen;
