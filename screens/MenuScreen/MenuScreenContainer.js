import React, { useState } from "react";
import MenuScreenView from "./MenuScreenView";

const MenuScreenContainer = () => {
  const [menuItems, setMenuItems] = useState([
    {
      id: "1",
      name: "Pizza",
      price: 10.99,
      cuisine: "Italian",
      image: "https://dummyimage.com/650x450/cc00cc/fff",
    },
    {
      id: "2",
      name: "Burger",
      price: 8.99,
      cuisine: "American",
      image: "https://dummyimage.com/650x450/cc00cc/fff",
    },
    {
      id: "3",
      name: "Sushi",
      price: 12.99,
      cuisine: "Japanese",
      image: "https://dummyimage.com/650x450/cc00cc/fff",
    },
  ]);

  const addMenuItem = (item) => {
    setMenuItems([...menuItems, { ...item, id: Date.now().toString() }]);
  };

  const deleteMenuItem = (id) => {
    setMenuItems(menuItems.filter((item) => item.id !== id));
  };

  const updateMenuItem = (id, updatedItem) => {
    setMenuItems(
      menuItems.map((item) =>
        item.id === id ? { ...item, ...updatedItem } : item
      )
    );
  };

  return (
    <MenuScreenView
      menuItems={menuItems}
      addMenuItem={addMenuItem}
      deleteMenuItem={deleteMenuItem}
      updateMenuItem={updateMenuItem}
    />
  );
};

export default MenuScreenContainer;
