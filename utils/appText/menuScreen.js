import { appDefaultLanguage } from "@/constants/appText/common";
import {
  UPDATE_MENU_CATEGORY_LANGUAGE_SET,
  ADD_MENU_ITEM_LANGUAGE_SET,
  CUISINE_LANGUAGE_SET,
  CATEGORY_LANGUAGE_SET,
  PRICE_LANGUAGE_SET,
  PREFERENCE_LANGUAGE_SET,
} from "@/constants/appText/menuScreen";

export const getUpdateMenuCategoryTranslation = (preferredLanguage) =>
  UPDATE_MENU_CATEGORY_LANGUAGE_SET[preferredLanguage] ||
  UPDATE_MENU_CATEGORY_LANGUAGE_SET[appDefaultLanguage];

export const getAddMenuItemTranslation = (preferredLanguage) =>
  ADD_MENU_ITEM_LANGUAGE_SET[preferredLanguage] ||
  ADD_MENU_ITEM_LANGUAGE_SET[appDefaultLanguage];

export const getCuisineTranslation = (preferredLanguage) =>
  CUISINE_LANGUAGE_SET[preferredLanguage] ||
  CUISINE_LANGUAGE_SET[appDefaultLanguage];

export const getCategoryTranslation = (preferredLanguage) =>
  CATEGORY_LANGUAGE_SET[preferredLanguage] ||
  CATEGORY_LANGUAGE_SET[appDefaultLanguage];

export const getPriceTranslation = (preferredLanguage) =>
  PRICE_LANGUAGE_SET[preferredLanguage] ||
  PRICE_LANGUAGE_SET[appDefaultLanguage];

export const getPreferenceTranslation = (preferredLanguage) =>
  PREFERENCE_LANGUAGE_SET[preferredLanguage] ||
  PREFERENCE_LANGUAGE_SET[appDefaultLanguage];
