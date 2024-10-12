import { db } from "@/firebase/firebaseConfig";
import {
  collection,
  getDocs,
  query,
  collectionGroup,
} from "firebase/firestore";

export const fetchLocations = async () => {
  try {
    const citiesQuery = query(collectionGroup(db, "cities"));
    const citiesSnapshot = await getDocs(citiesQuery);

    const locations = citiesSnapshot.docs.map((cityDoc) => {
      const cityPath = cityDoc.ref.path.split("/");
      return {
        country: cityPath[1], // The country name (document ID)
        state: cityPath[3], // The state name (document ID)
        city: cityPath[5], // The city name (document ID)
        countryId: cityPath[1],
        stateId: cityPath[3],
        cityId: cityPath[5],
      };
    });

    return locations;
  } catch (error) {
    console.error("Error in fetchLocations:", error);
    throw error;
  }
};

export const fetchRestaurants = async (location) => {
  try {
    const { countryId, stateId, cityId } = location;
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

    const restaurants = hotelsSnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
    }));

    return restaurants;
  } catch (error) {
    console.error("Error in fetchRestaurants:", error);
    throw error;
  }
};
