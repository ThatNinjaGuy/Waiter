import React, { useState, useEffect, useContext } from "react";
import MenuScreenView from "./MenuScreenView";
import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";
import AuthScreen from "@/screens/AuthScreen/AuthScreen";
import AuthContext from "@/components/Authentication/AuthProvider";
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
import { isAdminEmployee } from "@/utils/entitlementManagement";
const MenuScreenContainer = () => {
  const { user } = useContext(AuthContext);
  const preferredLanguage = user?.preferredLanguage;
  const [isLoading, setIsLoading] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [menuItemCategories, setMenuItemCategories] = useState([]);
  const isMenuAddVisible = isAdminEmployee(user?.staffDetails?.role);
  const isMenuCategoryAddVisible = isAdminEmployee(user?.staffDetails?.role);
  const isMenuEditVisible = isAdminEmployee(user?.staffDetails?.role);

  useEffect(() => {
    setIsLoading(true);
    fetchMenuItems(setMenuItems, setIsLoading);
    fetchMenuItemCategories(setMenuItemCategories);
  }, []);

  const addMenuItem = (item) => {
    addMenuItems([item], menuItems, setMenuItems);
  };

  if (!user) return <AuthScreen />;

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <MenuScreenView
      menuItems={menuItems}
      preferredLanguage={preferredLanguage}
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
      isMenuAddVisible={isMenuAddVisible}
      isMenuCategoryAddVisible={isMenuCategoryAddVisible}
      isMenuEditVisible={isMenuEditVisible}
    />
  );
};

export default MenuScreenContainer;
