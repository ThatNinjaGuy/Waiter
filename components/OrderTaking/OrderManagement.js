import React, { useState, useEffect } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import Sidebar from "@/components/Sidebar/Sidebar";
import MenuItemGrid from "./MenuItemGrid";
import OrderDetails from "./OrderDetails";
import PaymentOptions from "./PaymentOptions";
import HeaderSection from "./HeaderSection";
import FloatingCloseButton from "@/components/FloatingCloseButton/FloatingCloseButton";
import { ThemedView } from "../common/ThemedView";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { aggregateOrders } from "@/utils/orderManagement";
import { generateUUID } from "@/utils/uuidGenerator";
import LoadingScreen from "../LoadingScreen/LoadingScreen";

const OrderManagement = ({
  items,
  onClose,
  updateOrder,
  handleCompleteOrder,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const [menuItems, setMenuItems] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState();

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(0);

  const [rawOrders, setRawOrders] = useState([]);
  const [orders, setOrders] = useState();
  const [updateFlag, setUpdateFlag] = useState(false);

  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768; // Adjust the breakpoint as needed

  useEffect(() => {
    setRawOrders(items);
  }, [items]);

  useEffect(() => {
    if (selectedCategory == 0) return setSelectedMenu(getFavoriteItems());
    setSelectedMenu(
      menuItems.filter((item) => item.category === categories[selectedCategory])
    );
  }, [selectedCategory, menuItems]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "hotel-details/menu/menu-items")
        );
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMenuItems(items);
        setIsLoading(false);
        // Creating a unique list of categories
        setCategories([
          "Favorites",
          ...new Set(items.map((item) => item.category)),
        ]);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };

    setIsLoading(true);
    fetchMenuItems();
  }, []);

  // Update orders whenever rawOrders changes
  useEffect(() => {
    setOrders(aggregateOrders(rawOrders));
  }, [rawOrders]);

  // Update Firebase whenever orders change
  useEffect(() => {
    if (updateFlag) {
      updateOrder(rawOrders);
      setUpdateFlag(false);
    }
  }, [rawOrders]);

  const onSidebarItemClicked = (item, idx) => {
    setSelectedCategory(idx);
  };

  const onMenuItemClick = (item) => {
    const orderItem = {
      id: generateUUID(),
      menuItemId: item.id,
      name: item.name,
      category: item.category,
      cuisine: item.cuisine,
      price: item.price,
      searchableKey: item.searchableKey,
      dietaryPreference: item.type,
      image: item.image,
      quantity: 1,
      status: "ACTIVE",
      itemValue: parseFloat(item.price) || 0, // Convert price to a number,
      orderTimestamp: Date.now(),
    };
    addItem(orderItem);
  };

  const addItem = (item) => {
    const newOrders = rawOrders ? [...rawOrders, item] : [item];
    setRawOrders(newOrders);
    setUpdateFlag(true);
  };

  const removeItem = (item) => {
    // Find the first item with the same name, category, and status ACTIVE
    const index = rawOrders.findIndex(
      (orderItem) =>
        orderItem.name === item.name &&
        orderItem.category === item.category &&
        orderItem.status === "ACTIVE"
    );

    if (index !== -1) {
      const newOrders = [...rawOrders]; // Create a copy of the orders array
      newOrders.splice(index, 1); // Remove the item at the specified index
      setRawOrders(newOrders); // Update the state with the new array
      setUpdateFlag(true);
    } else {
      console.log("No active item found to decrease quantity.");
    }
  };

  const getFavoriteItems = () => {
    return menuItems;
    // return menuItems.filter((item) => item.orderCountPercentile > 70);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ThemedView style={styles.mainContainer}>
      {/* <HeaderSection /> */}
      <FloatingCloseButton onClose={onClose} />
      <ThemedView
        style={[
          styles.container,
          isLargeScreen ? styles.containerRow : styles.containerColumn,
        ]}
      >
        <ThemedView
          style={[
            styles.menuContent,
            isLargeScreen ? styles.menuContentRow : styles.menuContentColumn,
          ]}
          x
        >
          <Sidebar
            items={categories}
            style={isLargeScreen ? styles.sidebarRow : styles.sidebarColumn}
            onItemClick={onSidebarItemClicked}
            selectedItemIndex={selectedCategory}
          />
          <MenuItemGrid
            menuItems={selectedMenu}
            onItemClick={onMenuItemClick}
            style={styles.menuItemGrid}
          />
        </ThemedView>
        <ThemedView style={styles.orderAndPayment}>
          <OrderDetails
            orders={orders}
            style={styles.orderDetails}
            increaseQuantity={addItem}
            decreaseQuantity={removeItem}
          />
          <PaymentOptions
            style={styles.paymentOptions}
            onSave={onClose}
            onCancel={onClose}
            completeOrder={handleCompleteOrder}
          />
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    width: "100%",
  },
  containerRow: {
    flexDirection: "row",
  },
  containerColumn: {
    flexDirection: "column",
  },
  menuContent: {
    flexDirection: "row",
  },
  menuContentRow: {
    width: "60%",
  },
  menuContentColumn: {
    width: "100%",
    height: "60%",
  },
  sidebarRow: {
    // width: "40%",
  },
  sidebarColumn: {
    // width: "35%",
  },
  menuItemGrid: {
    flex: 1,
    flexWrap: "wrap",
  },
  orderAndPayment: {
    flex: 1,
    flexDirection: "column",
  },
  orderDetails: {
    flex: 1,
  },
  paymentOptions: {
    height: 60,
  },
});

export default OrderManagement;
