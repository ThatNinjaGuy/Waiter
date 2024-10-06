import React, { useContext } from "react";
import OrdersScreen from "./OrdersScreen";
import { View } from "react-native";
import AuthContext from "@/components/Authentication/AuthProvider";
import AuthScreen from "@/screens/AuthScreen/AuthScreen";
import { updateOrderStatus } from "@/firebase/queries/tables";
import { sendNotification } from "@/utils/sendNotification";
import { identifyNotificationTokens } from "@/utils/sendNotification";

const OrdersScreenContainer = () => {
  const { user, liveOrders, staffs } = useContext(AuthContext);

  const handleUpdateOrderStatus = async (
    orderId,
    orderName,
    tableId,
    tableName,
    newStatus
  ) => {
    sendNotification(
      "Order Status Updated",
      `${orderName} for table ${tableName} has been updated to ${newStatus}`,
      identifyNotificationTokens(staffs)
    );
    await updateOrderStatus(orderId, tableId, newStatus);
  };

  if (!user) return <AuthScreen />;

  return (
    <View style={{ flex: 1 }}>
      <OrdersScreen
        orders={liveOrders}
        updateOrderStatus={handleUpdateOrderStatus}
        user={user}
      />
    </View>
  );
};

export default OrdersScreenContainer;
