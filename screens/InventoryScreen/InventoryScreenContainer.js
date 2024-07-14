import React, { useState } from "react";
import InventoryScreenView from "./InventoryScreenView";

const InventoryScreenContainer = () => {
  const [inventoryItems, setInventoryItems] = useState([
    {
      id: "1",
      name: "Onion",
      price: 10.99,
      unit: "Kg",
      quantity: 4,
      image: "https://dummyimage.com/650x450/cc00cc/fff",
    },
    {
      id: "2",
      name: "Potato",
      price: 8.99,
      unit: "Kg",
      quantity: 14,
      image: "https://dummyimage.com/650x450/cc00cc/fff",
    },
    {
      id: "3",
      name: "Milk",
      price: 12.99,
      unit: "l",
      quantity: 40,
      image: "https://dummyimage.com/650x450/cc00cc/fff",
    },
  ]);

  const addInventoryItem = (item) => {
    setInventoryItems([
      ...inventoryItems,
      { ...item, id: Date.now().toString() },
    ]);
  };

  const deleteInventoryItem = (id) => {
    setInventoryItems(inventoryItems.filter((item) => item.id !== id));
  };

  const updateInventoryItem = (id, updatedItem) => {
    setInventoryItems(
      inventoryItems.map((item) =>
        item.id === id ? { ...item, ...updatedItem } : item
      )
    );
  };

  return (
    <InventoryScreenView
      inventoryItems={inventoryItems}
      addInventoryItem={addInventoryItem}
      deleteInventoryItem={deleteInventoryItem}
      updateInventoryItem={updateInventoryItem}
    />
  );
};

export default InventoryScreenContainer;
