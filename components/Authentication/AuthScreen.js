import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  Image,
  SafeAreaView,
  Alert,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { doc, writeBatch, collection } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { Picker } from "@react-native-picker/picker";
import { validateSignupRequest } from "@/utils/validations";
import LoadingScreen from "../LoadingScreen/LoadingScreen";

const AuthScreen = () => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [age, setAge] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authReqResponse, setAuthReqResponse] = useState("");
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  const toggleMode = () => {
    setIsSignUpMode((prevMode) => !prevMode);
  };

  const handleSignUpRequest = async () => {
    const { isEmailValid, isPasswordValid } = validateSignupRequest(
      email,
      password
    );
    if (!isEmailValid) {
      setAuthReqResponse("Email is invalid. Please check and try again.");
      return;
    }
    if (!isPasswordValid) {
      setAuthReqResponse("Password must have atleast 6 characters.");
      return;
    }
    const batch = writeBatch(db);
    const docRef = doc(
      collection(db, "hotel-details/staff-details/signup-requests")
    );
    batch.set(docRef, {
      name: name,
      age: age,
      email: email,
      role: role,
      mobile: mobile,
      password: password,
      createdAt: Date.now(),
    });
    try {
      await batch.commit();
      console.log("Batch write successful");
      Alert.alert(
        "Request submitted successfully",
        "Your sign up request has been sent successfully. Please try to sign in when your manager approves the request."
      );
      setAuthReqResponse(
        "Try to sign in when your manager approves the request."
      );
    } catch (error) {
      console.error("Error writing batch:", error);
      Alert.alert(
        "Failed to submit request",
        "An error occurred when submitting your sign up request. Please try again."
      );
      setAuthReqResponse("Please try again.");
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
    } catch (error) {
      console.error(error);
      if (error.code === "auth/user-disabled") {
        setAuthReqResponse(
          "This user account has been disabled. Please contact support."
        );
      } else if (error.code === "auth/invalid-credential") {
        setAuthReqResponse("Invalid credentials provided. Please try again.");
      } else {
        setAuthReqResponse(
          "An error occurred during sign-in. Please try again."
        );
      }
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.background} />
      <View style={styles.contentContainer}>
        <Image
          source={require("@/assets/images/adaptive-icon.png")}
          style={styles.logo}
        />
        <Text style={styles.welcomeText}>Welcome to Waiter</Text>
        <Text style={styles.subText}>
          Your one-stop solution for restaurant management
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputIcon}>✉️</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            inputMode="email-address"
            autoCapitalize="none"
          />
        </View>

        {isSignUpMode && (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>📞</Text>
              <TextInput
                style={styles.input}
                placeholder="Mobile Number"
                value={mobile}
                onChangeText={setMobile}
                inputMode="phone-pad"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>👤</Text>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.rowContainer}>
              <View style={styles.splitInputContainer}>
                <Text style={styles.inputIcon}>🎂</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Age"
                  value={age}
                  onChangeText={setAge}
                  inputMode="number-pad"
                />
              </View>
              <View style={styles.splitInputContainer}>
                <Text style={styles.inputIcon}>👤</Text>
                <Picker
                  selectedValue={role}
                  style={styles.picker}
                  onValueChange={(itemValue) => setRole(itemValue)}
                >
                  <Picker.Item label="Select Role" value="" />
                  <Picker.Item label="Manager" value="Manager" />
                  {/* <Picker.Item label="Chef" value="Chef" /> */}
                  <Picker.Item label="Cook" value="Cook" />
                  <Picker.Item label="Waiter" value="Waiter" />
                  <Picker.Item label="Assistant" value="Assistant" />
                  <Picker.Item label="Cleaner" value="Cleaner" />
                  <Picker.Item label="Heler" value="Heler" />
                  <Picker.Item label="Others" value="Others" />
                </Picker>
              </View>
            </View>
          </>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.inputIcon}>🔒</Text>
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={isSignUpMode ? handleSignUpRequest : handleSignIn}
        >
          <Text style={styles.buttonText}>
            {isSignUpMode ? "Sign Up" : "Sign In"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleMode}>
          <Text style={styles.toggleText}>
            {isSignUpMode
              ? "Already have an account! Sign In >>>"
              : "Don't have an account? Sign Up >>>"}
          </Text>
        </TouchableOpacity>

        {authReqResponse ? (
          <Text style={styles.termsText}>{authReqResponse}</Text>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#f5f5f5",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    maxWidth: 500,
    width: "100%",
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: 10,
    // Provides a shadow to seperate the background from the main view
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    elevation: 5,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  subText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    width: "100%",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 15,
  },
  splitInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
    paddingHorizontal: 10,
    width: "48%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  picker: {
    flex: 1,
    height: 49,
    color: "#333",
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
    borderWidth: 0,
    paddingHorizontal: 5,
  },
  inputIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: "#333",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginBottom: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  termsText: {
    fontSize: 12,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  toggleText: {
    color: "#007AFF",
    fontSize: 12,
    marginTop: 10,
    textAlign: "center",
  },
});

export default AuthScreen;
