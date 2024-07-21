import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Sidebar from "@/components/Sidebar/Sidebar";
import MenuItemGrid from "./MenuItemGrid";
import OrderDetails from "./OrderDetails";
import PaymentOptions from "./PaymentOptions";
import FloatingCloseButton from "@/components/FloatingCloseButton/FloatingCloseButton";

const categories = [
  "Beverages",
  "Burgers",
  "EGG",
  "Chicken",
  "Chakhna",
  "Chinese Snacks",
  "Chinese Soups",
  "Garlic Bread",
  "Gravy Items",
  "Hawaiian Wraps",
  "Maggie Lover",
];

const menuItems = [
  {
    name: "Aloo Tikki Burger",
    type: "vegetarian",
    orderCountPercentile: 80,
    available: true,
    category: "Burgers",
    price: 100,
  },
  {
    name: "Cheese Garlic Bread",
    type: "vegetarian",
    orderCountPercentile: 60,
    available: true,
    category: "Garlic Bread",
    price: 80,
  },
  {
    name: "Chicken Angara (Boneless)",
    type: "nonVeg",
    orderCountPercentile: 90,
    available: true,
    category: "Chicken",
    price: 300,
  },
  {
    name: "Chilli Mushroom",
    type: "vegetarian",
    orderCountPercentile: 50,
    available: true,
    category: "Chinese Snacks",
    price: 200,
  },
  {
    name: "Dahi Ke Shole",
    type: "vegetarian",
    orderCountPercentile: 40,
    available: false,
    category: "Chakhna",
    price: 150,
  },
  {
    name: "Fry Masala Papad",
    type: "vegetarian",
    orderCountPercentile: 30,
    available: true,
    category: "Chakhna",
    price: 10,
  },
  {
    name: "Green Salad",
    type: "vegan",
    orderCountPercentile: 70,
    available: true,
    category: "Gravy Items",
    price: 100,
  },
  {
    name: "Grilled Paneer Sandwich",
    type: "vegetarian",
    orderCountPercentile: 85,
    available: true,
    category: "Burgers",
    price: 120,
  },
  {
    name: "Hakka Noodles",
    type: "vegetarian",
    orderCountPercentile: 55,
    available: true,
    category: "Chinese Snacks",
    price: 80,
  },
  {
    name: "Masala Dosa",
    type: "vegetarian",
    orderCountPercentile: 75,
    available: true,
    category: "Gravy Items",
    price: 100,
  },
  {
    name: "Omelette (3 Eggs)",
    type: "egg",
    orderCountPercentile: 65,
    available: true,
    category: "EGG",
    price: 100,
  },
  {
    name: "Open Item",
    type: "vegetarian",
    orderCountPercentile: 20,
    available: false,
    category: "Gravy Items",
    price: 100,
  },
  {
    name: "Oreo Shake",
    type: "vegetarian",
    orderCountPercentile: 50,
    available: true,
    category: "Beverages",
    price: 80,
  },
  {
    name: "Paneer Wrap",
    type: "vegetarian",
    orderCountPercentile: 80,
    available: true,
    category: "Hawaiian Wraps",
    price: 100,
  },
  {
    name: "Raj Kachodi",
    type: "vegetarian",
    orderCountPercentile: 45,
    available: true,
    category: "Chakhna",
    price: 40,
  },
  {
    name: "RasMalai",
    type: "vegetarian",
    orderCountPercentile: 35,
    available: true,
    category: "Gravy Items",
    price: 25,
  },
  {
    name: "Salted Lassi",
    type: "vegetarian",
    orderCountPercentile: 25,
    available: true,
    category: "Beverages",
    price: 40,
  },
  {
    name: "Spl. Shahi Paneer",
    type: "vegetarian",
    orderCountPercentile: 90,
    available: true,
    category: "Gravy Items",
    price: 200,
  },
  {
    name: "Spring Roll",
    type: "vegetarian",
    orderCountPercentile: 60,
    available: true,
    category: "Chinese Snacks",
    price: 60,
  },
  {
    name: "Strawberry Mojito",
    type: "vegan",
    orderCountPercentile: 70,
    available: true,
    category: "Beverages",
    price: 100,
  },
  {
    name: "Sweet Corn Soup",
    type: "vegetarian",
    orderCountPercentile: 50,
    available: true,
    category: "Chinese Soups",
    price: 50,
  },
  {
    name: "Tandoori Momos (8 Pcs)",
    type: "vegetarian",
    orderCountPercentile: 85,
    available: true,
    category: "Chinese Snacks",
    price: 80,
  },
  {
    name: "Tandoori Pasta",
    type: "vegetarian",
    orderCountPercentile: 75,
    available: true,
    category: "Chinese Snacks",
    price: 180,
  },
  {
    name: "Veg Burger",
    type: "vegetarian",
    orderCountPercentile: 60,
    available: true,
    category: "Burgers",
    price: 60,
  },
  {
    name: "Water Bottle",
    type: "vegan",
    orderCountPercentile: 40,
    available: true,
    category: "Beverages",
    price: 20,
  },
];

const OrderManagement = ({ items, onClose, updateOrder }) => {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [selectedMenu, setSelectedMenu] = useState();
  const [orders, setOrders] = useState(items ? items : []);

  useEffect(() => {
    setSelectedMenu(
      menuItems.filter((item) => item.category === categories[selectedCategory])
    );
  }, [selectedCategory]);

  useEffect(() => updateOrder(orders), [orders]);

  const onSidebarItemClicked = (item, idx) => {
    setSelectedCategory(idx);
  };

  const onMenuItemClick = (item, index) => {
    console.log(item);
    const idx = getItemIndexInOrderBook(item);
    if (idx === -1) {
      // Add new item to the order
      item.quantity = 1;
      item.itemValue = item.price * item.quantity;
      setOrders([...orders, item]);
    } else increaseQuantity(idx);
  };

  const getItemIndexInOrderBook = (item) => {
    return orders.findIndex(
      (orderItem) =>
        orderItem.name === item.name && orderItem.category === item.category
    );
  };

  const increaseQuantity = (index) => {
    const newOrderItems = [...orders];
    newOrderItems[index].quantity += 1;
    newOrderItems[index].itemValue =
      newOrderItems[index].price * newOrderItems[index].quantity;
    setOrders(newOrderItems);
  };

  const decreaseQuantity = (index) => {
    const newOrderItems = [...orders];
    if (newOrderItems[index].quantity > 1) {
      newOrderItems[index].quantity -= 1;
      newOrderItems[index].itemValue =
        newOrderItems[index].price * newOrderItems[index].quantity;
      setOrders(newOrderItems);
    } else removeItem(index);
  };

  const removeItem = (index) => {
    const newOrders = [...orders]; // Create a copy of the orders array
    newOrders.splice(index, 1); // Remove the item at the specified index
    setOrders(newOrders); // Update the state with the new array
  };

  return (
    <View style={styles.container}>
      <FloatingCloseButton onClose={onClose} />
      <Sidebar
        items={categories}
        style={styles.sidebar}
        onItemClick={onSidebarItemClicked}
      />
      <View style={styles.mainContent}>
        <MenuItemGrid
          menuItems={selectedMenu}
          onItemClick={onMenuItemClick}
          style={styles.menuItemGrid}
        />
        <View style={styles.orderAndPayment}>
          <OrderDetails
            orders={orders}
            style={styles.orderDetails}
            increaseQuantity={increaseQuantity}
            decreaseQuantity={decreaseQuantity}
            removeItem={removeItem}
          />
          <PaymentOptions style={styles.paymentOptions} onSave={onClose} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  sidebar: {
    width: "10%",
  },
  mainContent: {
    width: "90%",
    flexDirection: "row",
  },
  menuItemGrid: {
    flex: 1,
    // width: "50%",
  },
  orderAndPayment: {
    // flex: 1,
    flexDirection: "column",
    width: "50%",
  },
  orderDetails: {
    flex: 1,
  },
  paymentOptions: {
    height: 60,
  },
});

export default OrderManagement;
