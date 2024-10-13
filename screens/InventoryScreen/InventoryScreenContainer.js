import React, { useState, useEffect, useContext } from "react";
import InventoryScreenView from "./InventoryScreenView";
import { generateUniqueKey } from "@/utils/keyGenerator";
import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";
import AuthContext from "@/components/Authentication/AuthProvider";
import AuthScreen from "@/screens/AuthScreen/AuthScreen";
import { isAdminEmployee } from "@/utils/entitlementManagement";
import {
  fetchInventoryItems,
  addInventoryItems,
  deleteInventoryItem,
  updateInventoryItem,
} from "@/firebase/queries/inventory";

const InventoryScreenContainer = () => {
  const { user, restaurantPath } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [inventoryItems, setInventoryItems] = useState([]);
  const isInventoryItemClickable = isAdminEmployee(user.staffDetails?.role);
  const isAddItemButtonVisible = isAdminEmployee(user.staffDetails?.role);

  useEffect(() => {
    setIsLoading(true);
    fetchInventoryItems(restaurantPath, setInventoryItems, setIsLoading);
  }, [restaurantPath]);

  const addInventoryItem = (item) => {
    item.searchableKey = generateUniqueKey(inventoryItems, item);
    addInventoryItems(
      restaurantPath,
      [item],
      inventoryItems,
      setInventoryItems
    );
  };

  const handleDeleteInventoryItem = (id) => {
    deleteInventoryItem(restaurantPath, id, inventoryItems, setInventoryItems);
  };

  const handleUpdateInventoryItem = (id, updatedItem) => {
    updateInventoryItem(
      restaurantPath,
      id,
      updatedItem,
      inventoryItems,
      setInventoryItems
    );
  };

  if (!user) return <AuthScreen />;

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <InventoryScreenView
      inventoryItems={inventoryItems}
      addInventoryItem={addInventoryItem}
      deleteInventoryItem={handleDeleteInventoryItem}
      updateInventoryItem={handleUpdateInventoryItem}
      isInventoryItemClickable={isInventoryItemClickable}
      isAddItemButtonVisible={isAddItemButtonVisible}
    />
  );
};

export default InventoryScreenContainer;
