export const ORDER_STATUS = {
  // Order is placed but not picked up by the kitchen
  ACTIVE: "ACTIVE",
  // Order has been picked up by the kitchen
  PENDING: "PENDING",
  // Order has been completed by the kitchen
  READY: "READY",
  // Order has been delivered to the table/ picked up from the kitchen by the server
  COMPLETE: "COMPLETE",
  // Order is denied acceptance by the kitchen
  CANCEL: "CANCEL",
  // Order has been cancelled by the kitchen and the server has been notified
  CANCELLED: "CANCELLED",
};

// Define arrays for different order categories
export const ACTIVE_ORDERS = [
  ORDER_STATUS.ACTIVE,
  ORDER_STATUS.PENDING,
  ORDER_STATUS.CANCEL,
  ORDER_STATUS.READY,
];
export const ORDERS_PENDING_ACTION = [
  ORDER_STATUS.ACTIVE,
  ORDER_STATUS.CANCEL,
  ORDER_STATUS.READY,
];
export const IN_KITCHEN_ORDERS = [ORDER_STATUS.PENDING];
export const COMPLETED_ORDERS = [ORDER_STATUS.COMPLETE];
export const CANCELLED_ORDERS = [ORDER_STATUS.CANCEL, ORDER_STATUS.CANCELLED];
export const ALL_KITCHEN_ORDERS = [ORDER_STATUS.ACTIVE, ORDER_STATUS.PENDING];
export const ALL_SERVER_ORDERS = [ORDER_STATUS.READY, ORDER_STATUS.CANCEL];
