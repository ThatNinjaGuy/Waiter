import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  collection,
  query,
  onSnapshot,
  writeBatch,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { db } from "@/firebase/firebaseConfig";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { firebaseConfig } from "@/firebase/firebaseConfig";

const ApproveSignUpRequestsScreen = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  // Create a secondary app for user creation
  const secondaryApp = initializeApp(firebaseConfig, "Secondary");

  useEffect(() => {
    const fetchAllSignupRequests = async () => {
      try {
        const signUpRequests = collection(
          db,
          "hotel-details/staff-details/signup-requests"
        );
        const q = query(signUpRequests);

        // Set up real-time listener
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const allRequests = [];
          querySnapshot.docs.forEach((doc) => {
            allRequests.push({ id: doc.id, ...doc.data() });
          });
          setRequests(allRequests);
          setLoading(false);
        });
        // Clean up the listener on component unmount
        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching user sign up requests:", error);
      }
    };

    setLoading(true);
    fetchAllSignupRequests();
  }, []);

  const handleSignUp = async ({ email, password }) => {
    var errorMessage = "";
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
        throw new Error(
          "This email is already in use. Please try another one."
        );
      } else {
        throw new Error("An error occurred during sign-up. Please try again.");
      }
    }
  };

  const addToStaffs = async ({ name, email, role, age, mobile, authId }) => {
    const batch = writeBatch(db);
    const docRef = doc(collection(db, "hotel-details/staff-details/staffs"));
    batch.set(docRef, {
      name: name,
      age: age,
      email: email,
      role: role,
      authId: authId,
      mobile: mobile,
      createdAt: Date.now(),
    });
    try {
      await batch.commit();
      console.log("Batch write successful");
    } catch (error) {
      console.error("Error writing batch:", error);
    }
  };

  const deleteRequest = async ({ id }) => {
    try {
      const docRef = doc(db, "hotel-details/staff-details/signup-requests", id);
      await deleteDoc(docRef);
      console.log("Document successfully deleted!");
    } catch (error) {
      console.error("Error removing document: ", error);
      throw error;
    }
  };

  const handleApprove = async (id) => {
    console.log("id: ", id);
    const request = requests.find((item) => item.id === id);
    try {
      setLoading(true);
      request.authId = await handleSignUp(request);
      console.log(request);
      addToStaffs(request);
      deleteRequest(request);
      console.log("Approval requests updated");
    } catch (error) {
      console.error(error);
      Alert.alert("Failed to approve request", error.message);
    }
    setLoading(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.requestItem}>
      <View style={styles.requestInfo}>
        <Text style={styles.requestName}>{item.name}</Text>
        <Text style={styles.requestEmail}>{item.email}</Text>
      </View>
      <TouchableOpacity
        style={styles.approveButton}
        onPress={() => handleApprove(item.id)}
      >
        <LinearGradient
          colors={["#4c669f", "#3b5998", "#192f6a"]}
          style={styles.approveGradient}
        >
          <Ionicons name="checkmark-outline" size={24} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4c669f" />
      </View>
    );
  }

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Approve Sign Up Requests</Text>
      {requests.length === 0 ? (
        <Text style={styles.noRequestsText}>No pending requests</Text>
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
