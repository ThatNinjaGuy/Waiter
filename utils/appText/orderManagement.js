import { appDefaultLanguage } from "@/constants/appText/common";
import {
  CANCEL_LANGUAGE_SET,
  GENERATE_BILL_LANGUAGE_SET,
  KOT_LANGUAGE_SET,
} from "@/constants/appText/orderManagement";

export const getCancelTranslation = (preferredLanguage) =>
  CANCEL_LANGUAGE_SET[preferredLanguage] ||
  CANCEL_LANGUAGE_SET[appDefaultLanguage];

export const getGenerateBillTranslation = (preferredLanguage) =>
  GENERATE_BILL_LANGUAGE_SET[preferredLanguage] ||
  GENERATE_BILL_LANGUAGE_SET[appDefaultLanguage];

export const getKOTTranslation = (preferredLanguage) =>
  KOT_LANGUAGE_SET[preferredLanguage] || KOT_LANGUAGE_SET[appDefaultLanguage];
