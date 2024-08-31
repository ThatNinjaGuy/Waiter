export function aggregateOrders(rawOrders) {
  if (!rawOrders || rawOrders.length === 0) return [];
  const aggregatedOrders = rawOrders.reduce((acc, rawOrder) => {
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
        dietaryPreference: rawOrder.type,
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
  return orders.reduce(
    (total, order) => total + order.price * order.quantity,
    0
  );
}

export function calculateTotalOrderCount(orders) {
  return orders.reduce((total, order) => total + order.quantity, 0);
}
