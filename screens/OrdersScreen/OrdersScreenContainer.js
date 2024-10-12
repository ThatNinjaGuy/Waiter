import React, { useContext } from "react";
import OrdersScreen from "./OrdersScreen";
import { View } from "react-native";
import AuthContext from "@/components/Authentication/AuthProvider";
import AuthScreen from "@/screens/AuthScreen/AuthScreen";
import { updateOrderStatus } from "@/firebase/queries/tables";
import { sendNotification } from "@/utils/sendNotification";
import { identifyNotificationTokens } from "@/utils/sendNotification";
import {
  ALL_COMPLETE_ORDERS,
  ALL_SERVER_ORDERS,
} from "@/constants/status/orders";
import {
  ORDER_COMPLETED,
  ORDER_READY,
  UNKNOWN_CATEGORY,
} from "@/constants/notificationControls";

const OrdersScreenContainer = () => {
  const { user, liveOrders, staffs } = useContext(AuthContext);

  const handleUpdateOrderStatus = async (
    orderId,
    orderName,
    tableId,
    tableName,
    newStatus
  ) => {
    let notificationCategory;
    if (ALL_SERVER_ORDERS.includes(newStatus)) {
      notificationCategory = ORDER_READY;
    } else if (ALL_COMPLETE_ORDERS.includes(newStatus)) {
      notificationCategory = ORDER_COMPLETED;
    } else {
      notificationCategory = UNKNOWN_CATEGORY;
    }

    const tokens = identifyNotificationTokens(staffs, notificationCategory);

    if (tokens.length > 0) {
      sendNotification(
        "Order Status Updated",
        `${orderName} for table ${tableName} has been updated to ${newStatus}`,
        tokens
      );
    }

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
