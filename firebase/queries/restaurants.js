import { Platform } from "react-native";
import { db } from "@/firebase/firebaseConfig";

export const fetchLocations = async () => {
  try {
    let locations = [];
    if (Platform.OS === "web") {
      const { query, collectionGroup, getDocs } = await import(
        "firebase/firestore"
      );
      const citiesQuery = query(collectionGroup(db, "cities"));
      const citiesSnapshot = await getDocs(citiesQuery);
      locations = citiesSnapshot.docs.map(mapCityDocToLocation);
    } else {
      const citiesSnapshot = await db.collectionGroup("cities").get();
      locations = citiesSnapshot.docs.map(mapCityDocToLocation);
    }
    return locations;
  } catch (error) {
    console.error("Error in fetchLocations:", error);
    throw error;
  }
};

const mapCityDocToLocation = (cityDoc) => {
  const cityPath = cityDoc.ref.path.split("/");
  return {
    country: cityPath[1],
    state: cityPath[3],
    city: cityPath[5],
    countryId: cityPath[1],
    stateId: cityPath[3],
    cityId: cityPath[5],
  };
};

export const fetchRestaurants = async (location) => {
  try {
    const { countryId, stateId, cityId } = location;
    let restaurants = [];
    if (Platform.OS === "web") {
      const { collection, getDocs } = await import("firebase/firestore");
      const hotelsRef = collection(
        db,
        "restaurants",
        countryId,
        "states",
        stateId,
        "cities",
        cityId,
        "hotels"
      );
      const hotelsSnapshot = await getDocs(hotelsRef);
      restaurants = hotelsSnapshot.docs.map(mapDocToRestaurant);
    } else {
      const hotelsRef = db
        .collection("restaurants")
        .doc(countryId)
        .collection("states")
        .doc(stateId)
        .collection("cities")
        .doc(cityId)
        .collection("hotels");
      const hotelsSnapshot = await hotelsRef.get();
      restaurants = hotelsSnapshot.docs.map(mapDocToRestaurant);
    }
    return restaurants;
  } catch (error) {
    console.error("Error in fetchRestaurants:", error);
    throw error;
  }
};

const mapDocToRestaurant = (doc) => ({
  id: doc.id,
  name: doc.data().name,
});
