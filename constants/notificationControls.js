export const NEW_ORDERS = "newOrders";
export const ORDER_READY = "orderReady";
export const ORDER_COMPLETED = "orderCompleted";
export const NEW_GUESTS = "newGuests";
export const UNKNOWN_CATEGORY = "unknownCategory";

export const DEFAULT_NOTIFICATION_SETTINGS = {
  [NEW_ORDERS]: true,
  [ORDER_READY]: true,
  [ORDER_COMPLETED]: true,
  [NEW_GUESTS]: false,
};

export const NOTIFICATION_SETTINGS_LABELS = [
  {
    displayText: "New Order receivied",
    key: NEW_ORDERS,
  },
  {
    displayText: "Order Ready for pickup",
    key: ORDER_READY,
  },
  {
    displayText: "Order Complete",
    key: ORDER_COMPLETED,
  },
  //   {
  //     displayText: "New Guest arrived",
  //     key: NEW_GUESTS,
  //   },
];
