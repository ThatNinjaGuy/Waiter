import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  Image,
  SafeAreaView,
} from "react-native";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { setDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { Picker } from "@react-native-picker/picker";

const AuthScreen = () => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState();
  const [age, setAge] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInFailedError, setSignInFailedError] = useState();
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  const toggleMode = () => {
    setIsSignUpMode((prevMode) => !prevMode);
  };

  const handleSignUp = async () => {
    try {
      // Create the user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Add additional user details to Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        age: age,
        email: email,
        role: role,
        mobile: mobile,
        createdAt: Date.now(),
      });

      console.log("User signed up successfully with ID:", user.uid);
      // You can navigate to the next screen or update UI here
    } catch (error) {
      console.error(error);
      if (error.code === "auth/email-already-in-use") {
        setSignInFailedError(
          "This email is already in use. Please try another one."
        );
      } else {
        setSignInFailedError(
          "An error occurred during sign-up. Please try again."
        );
      }
    }
  };

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      // const user = userCredential.user;

      // Retrieve additional user details from Firestore
      // const userDoc = await getDoc(doc(db, "users", user.uid));
      // if (userDoc.exists()) {
      //   const userData = userDoc.data();
      //   console.log("User signed in:", user.uid, userData);
      //   // You can store user data in state or context here
      // } else {
      //   console.log("No additional user data found");
      // }

      // Navigate to the next screen or update UI
    } catch (error) {
      console.error(error);
      if (error.code === "auth/user-disabled") {
        setSignInFailedError(
          "This user account has been disabled. Please contact support."
        );
      } else if (error.code === "auth/invalid-credential") {
        setSignInFailedError("Invalid credentials provided. Please try again.");
      } else {
        setSignInFailedError(
          "An error occurred during sign-in. Please try again."
        );
      }
    }
  };

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
            keyboardType="email-address"
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
                keyboardType="phone-pad"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>👤</Text>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
                keyboardType="default"
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
                  keyboardType="number-pad"
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
                  <Picker.Item label="Manager" value="manager" />
                  <Picker.Item label="Waiter" value="waiter" />
                  <Picker.Item label="Chef" value="chef" />
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
            keyboardType="visible-password"
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={isSignUpMode ? handleSignUp : handleSignIn}
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

        {signInFailedError ? (
          <Text style={styles.termsText}>{signInFailedError}</Text>
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
