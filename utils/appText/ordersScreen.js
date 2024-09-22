import { appDefaultLanguage } from "@/constants/appText/common";
import {
  QTY_LANGUAGE_SET,
  NOTES_LANGUAGE_SET,
  PENDING_ORDERS_LANGUAGE_SET,
  ACTIVE_ORDERS_LANGUAGE_SET,
  READY_FOR_PICKUP_LANGUAGE_SET,
  ACCEPT_LANGUAGE_SET,
  COMPLETE_LANGUAGE_SET,
  CANCEL_LANGUAGE_SET,
  DELIVERED_LANGUAGE_SET,
} from "@/constants/appText/ordersScreen";

export const getQtyTranslation = (preferredLanguage) =>
  QTY_LANGUAGE_SET[preferredLanguage] || QTY_LANGUAGE_SET[appDefaultLanguage];

export const getNotesTranslation = (preferredLanguage) =>
  NOTES_LANGUAGE_SET[preferredLanguage] ||
  NOTES_LANGUAGE_SET[appDefaultLanguage];

export const getPendingOrdersTranslation = (preferredLanguage) =>
  PENDING_ORDERS_LANGUAGE_SET[preferredLanguage] ||
  PENDING_ORDERS_LANGUAGE_SET[appDefaultLanguage];

export const getActiveOrdersTranslation = (preferredLanguage) =>
  ACTIVE_ORDERS_LANGUAGE_SET[preferredLanguage] ||
  ACTIVE_ORDERS_LANGUAGE_SET[appDefaultLanguage];

export const getReadyForPickupTranslation = (preferredLanguage) =>
  READY_FOR_PICKUP_LANGUAGE_SET[preferredLanguage] ||
  READY_FOR_PICKUP_LANGUAGE_SET[appDefaultLanguage];

export const getAcceptTranslation = (preferredLanguage) =>
  ACCEPT_LANGUAGE_SET[preferredLanguage] ||
  ACCEPT_LANGUAGE_SET[appDefaultLanguage];

export const getCompleteTranslation = (preferredLanguage) =>
  COMPLETE_LANGUAGE_SET[preferredLanguage] ||
  COMPLETE_LANGUAGE_SET[appDefaultLanguage];

export const getCancelTranslation = (preferredLanguage) =>
  CANCEL_LANGUAGE_SET[preferredLanguage] ||
  CANCEL_LANGUAGE_SET[appDefaultLanguage];

export const getDeliveredTranslation = (preferredLanguage) =>
  DELIVERED_LANGUAGE_SET[preferredLanguage] ||
  DELIVERED_LANGUAGE_SET[appDefaultLanguage];
