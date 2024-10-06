import React, { useState, useEffect } from "react";
import { Alert, StyleSheet, useWindowDimensions } from "react-native";
import Sidebar from "@/components/OrderManagement/Sidebar/Sidebar";
import MenuItemGrid from "@/components/OrderManagement/MenuItemGrid/MenuItemGrid";
import OrderDetails from "@/components/OrderDetails/OrderDetails";
import PaymentOptions from "@/components/OrderDetails/PaymentOptions";
import HeaderSection from "@/components/OrderDetails/HeaderSection";
import FloatingCloseButton from "@/components/FloatingCloseButton/FloatingCloseButton";
import { ThemedView } from "@/components/common/ThemedView";
import { aggregateOrders } from "@/utils/orderManagement";
import { generateUUID } from "@/utils/uuidGenerator";
import { ORDER_STATUS } from "@/constants/status/orders";

const OrderManagement = ({
  items,
  menuItems,
  preferredLanguage,
  onClose,
  updateOrder,
  handleCompleteOrder,
}) => {
  const [selectedMenu, setSelectedMenu] = useState();
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [rawOrders, setRawOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [orders, setOrders] = useState();

  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;

  const categories = [
    "Favorites",
    ...new Set(items ? items.map((item) => item.category) : []),
  ];

  useEffect(() => {
    setRawOrders(items);
  }, [items]);

  useEffect(() => {
    if (selectedCategory == 0) return setSelectedMenu(getFavoriteItems());
    setSelectedMenu(
      menuItems.filter((item) => item.category === categories[selectedCategory])
    );
  }, [selectedCategory, menuItems]);

  // Update orders whenever rawOrders or pendingOrders change
  useEffect(() => {
    setOrders(aggregateOrders([...rawOrders, ...pendingOrders]));
  }, [rawOrders, pendingOrders]);

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
      status: ORDER_STATUS.ACTIVE,
      itemValue: parseFloat(item.price) || 0,
      orderTimestamp: Date.now(),
    };
    addItem(orderItem);
  };

  const addItem = (item) => {
    setPendingOrders((prevPendingOrders) => [...prevPendingOrders, item]);
  };

  const removeItem = (item) => {
    const index = pendingOrders.findIndex(
      (orderItem) =>
        orderItem.name === item.name &&
        orderItem.category === item.category &&
        orderItem.status === ORDER_STATUS.ACTIVE
    );

    if (index !== -1) {
      setPendingOrders((prevPendingOrders) => {
        const newPendingOrders = [...prevPendingOrders];
        newPendingOrders.splice(index, 1);
        return newPendingOrders;
      });
    } else {
      Alert.alert("Item not found in pending orders");
    }
  };

  const getFavoriteItems = () => {
    return menuItems;
    // return menuItems.filter((item) => item.orderCountPercentile > 70);
  };

  const handleSave = () => {
    const updatedOrders = [...rawOrders, ...pendingOrders];
    updateOrder(updatedOrders, pendingOrders.length);
    setRawOrders(updatedOrders);
    setPendingOrders([]);
    onClose();
  };

  const completeOrder = () => {
    const updatedOrders = [...rawOrders, ...pendingOrders];
    updateOrder(updatedOrders, pendingOrders.length);
    setRawOrders(updatedOrders);
    setPendingOrders([]);
    handleCompleteOrder();
  };

  return (
    <ThemedView style={styles.mainContainer}>
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
            preferredLanguage={preferredLanguage}
            style={styles.paymentOptions}
            onSave={handleSave}
            onCancel={onClose}
            completeOrder={completeOrder}
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
