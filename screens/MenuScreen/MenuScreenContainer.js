import React, { useState, useEffect, useContext } from "react";
import MenuScreenView from "./MenuScreenView";
import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";
import AuthScreen from "@/components/Authentication/AuthScreen";
import AuthContext from "@/components/Authentication/AuthProvider";
import UnauthorizedScreen from "@/components/Authentication/UnauthorizedScreen";
import {
  fetchMenuItems,
  addMenuItems,
  updateMenuItem,
  deleteMenuItem,
} from "@/firebase/queries/menuItems";
import {
  fetchMenuItemCategories,
  addMenuItemCategory,
  updateMenuItemCategory,
  deleteMenuItemCategory,
} from "@/firebase/queries/menuItemCategories";

const MenuScreenContainer = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [menuItems, setMenuItems] = useState([]);
  const [menuItemCategories, setMenuItemCategories] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    fetchMenuItems(setMenuItems, setIsLoading);
    setIsLoading(false);
    fetchMenuItemCategories(setMenuItemCategories);
  }, []);

  const addMenuItem = (item) => {
    addMenuItems([item], menuItems, setMenuItems);
  };

  const { user } = useContext(AuthContext);
  if (!user) return <AuthScreen />;

  if (
    user.staffDetails &&
    !(
      user.staffDetails.role === "Manager" ||
      user.staffDetails.role === "Owner" ||
      !user.staffDetails.role ||
      user.staffDetails.role === ""
    )
  ) {
    return <UnauthorizedScreen />;
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <MenuScreenView
      menuItems={menuItems}
      addMenuItem={addMenuItem}
      deleteMenuItem={(id) => deleteMenuItem(id, menuItems, setMenuItems)}
      updateMenuItem={(id, updatedItem) =>
        updateMenuItem(id, updatedItem, menuItems, setMenuItems)
      }
      categories={menuItemCategories}
      setCategories={setMenuItemCategories}
      handleAddMenuItemCategory={addMenuItemCategory}
      handleUpdateMenuItemCategory={updateMenuItemCategory}
      handleDeleteMenuItemCategory={deleteMenuItemCategory}
    />
  );
};

export default MenuScreenContainer;
