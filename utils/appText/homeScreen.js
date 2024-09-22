import { appDefaultLanguage } from "@/constants/appText/common";
import {
  STAFFS_LANGUAGE_SET,
  TABLES_LANGUAGE_SET,
  MENU_LANGUAGE_SET,
  ORDERS_LANGUAGE_SET,
  INVENTORY_LANGUAGE_SET,
  PROFILE_LANGUAGE_SET,
  OVERVIEW_LANGUAGE_SET,
  OVERVIEW_ITEMS_LANGUAGE_SET,
} from "@/constants/appText/homeScreen";

export const getStaffsTranslation = (preferredLanguage) =>
  STAFFS_LANGUAGE_SET[preferredLanguage] ||
  STAFFS_LANGUAGE_SET[appDefaultLanguage];

export const getTablesTranslation = (preferredLanguage) =>
  TABLES_LANGUAGE_SET[preferredLanguage] ||
  TABLES_LANGUAGE_SET[appDefaultLanguage];

export const getMenuTranslation = (preferredLanguage) =>
  MENU_LANGUAGE_SET[preferredLanguage] || MENU_LANGUAGE_SET[appDefaultLanguage];

export const getOrdersTranslation = (preferredLanguage) =>
  ORDERS_LANGUAGE_SET[preferredLanguage] ||
  ORDERS_LANGUAGE_SET[appDefaultLanguage];

export const getInventoryTranslation = (preferredLanguage) =>
  INVENTORY_LANGUAGE_SET[preferredLanguage] ||
  INVENTORY_LANGUAGE_SET[appDefaultLanguage];

export const getProfileTranslation = (preferredLanguage) =>
  PROFILE_LANGUAGE_SET[preferredLanguage] ||
  PROFILE_LANGUAGE_SET[appDefaultLanguage];

export const getOverviewTranslation = (preferredLanguage) =>
  OVERVIEW_LANGUAGE_SET[preferredLanguage] ||
  OVERVIEW_LANGUAGE_SET[appDefaultLanguage];

export const getActiveTablesTranslation = (preferredLanguage) =>
  OVERVIEW_ITEMS_LANGUAGE_SET.ACTIVE_TABLES[preferredLanguage] ||
  OVERVIEW_ITEMS_LANGUAGE_SET.ACTIVE_TABLES.appDefaultLanguage;

export const getActiveOrdersTranslation = (preferredLanguage) =>
  OVERVIEW_ITEMS_LANGUAGE_SET.ACTIVE_ORDERS[preferredLanguage] ||
  OVERVIEW_ITEMS_LANGUAGE_SET.ACTIVE_ORDERS.appDefaultLanguage;

export const getClosedOrdersTranslation = (preferredLanguage) =>
  OVERVIEW_ITEMS_LANGUAGE_SET.CLOSED_ORDERS[preferredLanguage] ||
  OVERVIEW_ITEMS_LANGUAGE_SET.CLOSED_ORDERS.appDefaultLanguage;

export const getTodaysRevenueTranslation = (preferredLanguage) =>
  OVERVIEW_ITEMS_LANGUAGE_SET.TODAYS_REVENUE[preferredLanguage] ||
  OVERVIEW_ITEMS_LANGUAGE_SET.TODAYS_REVENUE.appDefaultLanguage;

export const getLast7DaysRevTranslation = (preferredLanguage) =>
  OVERVIEW_ITEMS_LANGUAGE_SET.LAST_7_DAYS_REV[preferredLanguage] ||
  OVERVIEW_ITEMS_LANGUAGE_SET.LAST_7_DAYS_REV.appDefaultLanguage;

export const getLastDayRevTranslation = (preferredLanguage) =>
  OVERVIEW_ITEMS_LANGUAGE_SET.LAST_DAY_REV[preferredLanguage] ||
  OVERVIEW_ITEMS_LANGUAGE_SET.LAST_DAY_REV.appDefaultLanguage;
