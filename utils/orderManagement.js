import {
  ACTIVE_ORDERS,
  COMPLETED_ORDERS,
  CANCELLED_ORDERS,
} from "@/constants/status/orders";

export function aggregateOrders(rawOrders) {
  if (!rawOrders || rawOrders.length === 0) return [];

  // Filter and sort orders using constants
  const sortedOrders = rawOrders
    .filter((order) => !CANCELLED_ORDERS.includes(order.status))
    .sort((a, b) => b.orderTimestamp - a.orderTimestamp);

  const aggregatedOrders = sortedOrders.reduce((acc, rawOrder) => {
    const existingOrder = acc.find(
      (order) =>
        order.name === rawOrder.name && order.category === rawOrder.category
    );

    if (existingOrder) {
      existingOrder.quantity += 1;
      existingOrder.itemValue += rawOrder.price;
    } else {
      acc.push({
        name: rawOrder.name,
        category: rawOrder.category,
        cuisine: rawOrder.cuisine,
        menuItemId: rawOrder.menuItemId,
        image: rawOrder.image,
        searchableKey: rawOrder.searchableKey,
        dietaryPreference: rawOrder.type || rawOrder.dietaryPreference,
        price: rawOrder.price,
        quantity: 1,
        itemValue: rawOrder.price,
      });
    }

    return acc;
  }, []);

  return aggregatedOrders;
}

export function calculateOrderValue(orders) {
  return !orders
    ? 0
    : orders.reduce(
        (total, order) =>
          CANCELLED_ORDERS.includes(order.status)
            ? total
            : total + order.price * order.quantity,
        0
      );
}

export function calculateTotalOrderCount(orders) {
  return !orders
    ? 0
    : orders.reduce(
        (total, order) =>
          !CANCELLED_ORDERS.includes(order.status)
            ? total + order.quantity
            : total,
        0
      );
}

export function completedOrdersCount(orders) {
  return !orders
    ? 0
    : orders.filter((order) => COMPLETED_ORDERS.includes(order.status)).length;
}

export function activeOrdersCount(orders) {
  return !orders
    ? 0
    : orders.filter((order) => ACTIVE_ORDERS.includes(order.status)).length;
}
