import React, { useState, useEffect, useContext } from "react";
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
import { Picker } from "@react-native-picker/picker";
import { validateSignupRequest } from "@/utils/validations";
import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";
import { Platform } from "react-native";
import { addSignUpRequest } from "@/firebase/queries/staffs";
import {
  fetchLocations,
  fetchRestaurants,
} from "@/firebase/queries/restaurants";
import AuthContext from "@/components/Authentication/AuthProvider";

const AuthScreen = () => {
  const { restaurantPath, updateRestaurantPath } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [age, setAge] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authReqResponse, setAuthReqResponse] = useState("");
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [restaurant, setRestaurant] = useState("");
  const [locations, setLocations] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    const loadLocations = async () => {
      try {
        const fetchedLocations = await fetchLocations();
        setLocations(fetchedLocations);
        if (restaurantPath) {
          const savedLocation = fetchedLocations.find(
            (loc) =>
              loc.countryId === restaurantPath.countryId &&
              loc.stateId === restaurantPath.stateId &&
              loc.cityId === restaurantPath.cityId
          );
          if (savedLocation) {
            setSelectedLocation(savedLocation);
          }
        }
      } catch (error) {
        console.error("Error loading locations:", error);
      }
    };
    loadLocations();
  }, [restaurantPath]);

  useEffect(() => {
    const loadRestaurants = async () => {
      if (selectedLocation) {
        try {
          const fetchedRestaurants = await fetchRestaurants(selectedLocation);
          setRestaurants(fetchedRestaurants);
          if (
            restaurantPath &&
            selectedLocation.countryId === restaurantPath.countryId &&
            selectedLocation.stateId === restaurantPath.stateId &&
            selectedLocation.cityId === restaurantPath.cityId
          ) {
            const savedRestaurant = fetchedRestaurants.find(
              (r) => r.id === restaurantPath.restaurantId
            );
            if (savedRestaurant) {
              setRestaurant(savedRestaurant);
            }
          }
        } catch (error) {
          console.error("Error loading restaurants:", error);
        }
      }
    };
    loadRestaurants();
  }, [selectedLocation, restaurantPath]);

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
      setAuthReqResponse("Password must have at least 6 characters.");
      return;
    }

    const userData = {
      name,
      age,
      email,
      role,
      mobile,
      password,
    };

    const success = await addSignUpRequest(restaurantPath, userData);

    if (success) {
      await saveRestaurantPath();
      Alert.alert(
        "Request submitted successfully",
        "Your sign up request has been sent successfully. Please try to sign in when your manager approves the request."
      );
      setAuthReqResponse(
        "Try to sign in when your manager approves the request."
      );
    } else {
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
      if (Platform.OS === "web") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await auth.signInWithEmailAndPassword(email, password);
      }
      await saveRestaurantPath();
    } catch (error) {
      console.error("Sign in error:", error);
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
    } finally {
      setLoading(false);
    }
  };

  const handleLocationChange = (locationIndex) => {
    if (locationIndex !== "") {
      const newLocation = locations[locationIndex];
      setSelectedLocation(newLocation);
    } else {
      setSelectedLocation(null);
    }
    setRestaurant(""); // Reset restaurant when location changes
  };

  const formatLocation = (location) => {
    return `${location.city}, ${location.state}, ${location.country}`;
  };

  const saveRestaurantPath = async () => {
    if (selectedLocation && restaurant) {
      const path = {
        countryId: selectedLocation.countryId,
        stateId: selectedLocation.stateId,
        cityId: selectedLocation.cityId,
        restaurantId: restaurant.id,
      };
      try {
        await updateRestaurantPath(path);
      } catch (error) {
        console.error("Error saving restaurant path:", error);
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
          source={require("@/assets/images/icon.png")}
          style={styles.logo}
        />
        <Text style={styles.welcomeText}>Welcome to Waiter</Text>
        <Text style={styles.subText}>
          Your one-stop solution for restaurant management
        </Text>

        <View style={[styles.splitInputContainer, styles.inputContainer]}>
          <Text style={styles.inputIcon}>📍</Text>
          <Picker
            selectedValue={
              selectedLocation
                ? locations.findIndex((loc) => loc === selectedLocation)
                : ""
            }
            style={styles.picker}
            onValueChange={handleLocationChange}
          >
            <Picker.Item label="Choose a location" value="" />
            {locations.map((loc, index) => (
              <Picker.Item
                key={index}
                label={formatLocation(loc)}
                value={index}
              />
            ))}
          </Picker>
        </View>

        <View style={[styles.splitInputContainer, styles.inputContainer]}>
          <Text style={styles.inputIcon}>🍽️</Text>
          <Picker
            selectedValue={restaurant ? restaurant.id : ""}
            style={styles.picker}
            onValueChange={(itemValue) =>
              setRestaurant(restaurants.find((r) => r.id === itemValue))
            }
            enabled={!!selectedLocation}
          >
            <Picker.Item label="Select your restaurant" value="" />
            {restaurants.map((rest) => (
              <Picker.Item key={rest.id} label={rest.name} value={rest.id} />
            ))}
          </Picker>
        </View>

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
                  <Picker.Item label="Helper" value="Helper" />
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
    height: 48,
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
