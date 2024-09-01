export const getDarkBgColorWithTableStatus = (
  status,
  orderCount,
  totalOrders
) => {
  if (
    status == "Occupied" &&
    orderCount &&
    totalOrders &&
    totalOrders > 0 &&
    orderCount == totalOrders
  )
    return "rgba(230, 255, 0, 0.8)";
  else if (
    status == "Occupied" &&
    orderCount &&
    totalOrders &&
    orderCount < totalOrders
  )
    return "rgba(0, 248, 31, 0.8)";
  else if (status == "Occupied" && totalOrders == 0)
    return "rgba(255, 89, 77, 0.79)";
  else if (status == "Reserved") return "rgba(14, 46, 233, 0.44)";
  else return "rgba(99, 102, 67, 0.78)";
};

export const getLightBgColorWithTableStatus = (
  status,
  orderCount,
  totalOrders
) => {
  if (
    status == "Occupied" &&
    orderCount &&
    totalOrders &&
    totalOrders > 0 &&
    orderCount == totalOrders
  )
    return "rgba(213, 235, 25, 0.8)";
  else if (
    status == "Occupied" &&
    orderCount &&
    totalOrders &&
    orderCount < totalOrders
  )
    return "rgba(0, 248, 31, 0.8)";
  else if (status == "Occupied" && totalOrders == 0)
    return "rgba(253, 18, 3, 0.54)";
  else if (status == "Reserved") return "rgba(14, 46, 233, 0.44)";
  else return "rgba(27, 12, 11, 0.56)";
};
