import { appDefaultLanguage } from "@/constants/appText/common";
import {
  ADD_TABLE_LANGUAGE_SET,
  TABLE_LANGUAGE_SET,
  GUEST_LANGUAGE_SET,
  GUESTS_LANGUAGE_SET,
  SERVER_LANGUAGE_SET,
  ORDERS_LANGUAGE_SET,
  BILL_LANGUAGE_SET,
  NOTES_LANGUAGE_SET,
} from "@/constants/appText/tablesScreen";

export const getAddTableTranslation = (preferredLanguage) =>
  ADD_TABLE_LANGUAGE_SET[preferredLanguage] ||
  ADD_TABLE_LANGUAGE_SET[appDefaultLanguage];

export const getTableTranslation = (preferredLanguage) =>
  TABLE_LANGUAGE_SET[preferredLanguage] ||
  TABLE_LANGUAGE_SET[appDefaultLanguage];

export const getGuestTranslation = (preferredLanguage) =>
  GUEST_LANGUAGE_SET[preferredLanguage] ||
  GUEST_LANGUAGE_SET[appDefaultLanguage];

export const getGuestsTranslation = (preferredLanguage) =>
  GUESTS_LANGUAGE_SET[preferredLanguage] ||
  GUESTS_LANGUAGE_SET[appDefaultLanguage];

export const getServerTranslation = (preferredLanguage) =>
  SERVER_LANGUAGE_SET[preferredLanguage] ||
  SERVER_LANGUAGE_SET[appDefaultLanguage];

export const getOrdersTranslation = (preferredLanguage) =>
  ORDERS_LANGUAGE_SET[preferredLanguage] ||
  ORDERS_LANGUAGE_SET[appDefaultLanguage];

export const getBillTranslation = (preferredLanguage) =>
  BILL_LANGUAGE_SET[preferredLanguage] || BILL_LANGUAGE_SET[appDefaultLanguage];

export const getNotesTranslation = (preferredLanguage) =>
  NOTES_LANGUAGE_SET[preferredLanguage] || NOTES_LANGUAGE_SET.ENGLISH;
