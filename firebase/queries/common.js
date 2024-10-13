export const constructHotelPath = (restaurantPath) => {
  const { countryId, stateId, cityId, restaurantId } = restaurantPath;
  return `restaurants/${countryId}/states/${stateId}/cities/${cityId}/hotels/${restaurantId}`;
};
