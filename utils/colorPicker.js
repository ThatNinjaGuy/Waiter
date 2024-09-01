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
    return "rgba(142, 149, 38, 0.8)";
  else if (
    status == "Occupied" &&
    orderCount &&
    totalOrders &&
    orderCount < totalOrders
  )
    return "rgba(38, 149, 59, 0.8)";
  else if (status == "Occupied" && totalOrders == 0)
    return "rgba(144, 38, 149, 0.8)";
  else if (status == "Reserved") return "rgba(38, 38, 149, 0.8)";
  else return "rgba(95, 95, 123, 0.8)";
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
