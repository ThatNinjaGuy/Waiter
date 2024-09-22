import { appDefaultLanguage } from "@/constants/appText/common";
import {
  SETTINGS_LANGUAGE_SET,
  APPROVE_SIGNUP_REQUESTS_LANGUAGE_SET,
  CHECKOUT_MENU_LANGUAGE_SET,
  INVENTORY_LANGUAGE_SET,
  EMPLOYEES_LANGUAGE_SET,
  LOGOUT_LANGUAGE_SET,
  NO_PENDING_SIGNUP_REQUESTS_LANGUAGE_SET,
  EMAIL_ALREADY_IN_USE_LANGUAGE_SET,
  PASSWORD_LENGTH_ERROR_LANGUAGE_SET,
  SIGNUP_ERROR_LANGUAGE_SET,
  SUCCESS_LANGUAGE_SET,
  REQUEST_APPROVED_SUCCESS_LANGUAGE_SET,
  FAILED_TO_APPROVE_REQUEST_LANGUAGE_SET,
} from "@/constants/appText/profileScreen";

export const getSettingsText = (preferredLanguage) =>
  SETTINGS_LANGUAGE_SET[preferredLanguage] ||
  SETTINGS_LANGUAGE_SET[appDefaultLanguage];

export const getApproveSignupRequestsTranslation = (preferredLanguage) =>
  APPROVE_SIGNUP_REQUESTS_LANGUAGE_SET[preferredLanguage] ||
  APPROVE_SIGNUP_REQUESTS_LANGUAGE_SET[appDefaultLanguage];

export const getCheckoutMenuTranslation = (preferredLanguage) =>
  CHECKOUT_MENU_LANGUAGE_SET[preferredLanguage] ||
  CHECKOUT_MENU_LANGUAGE_SET[appDefaultLanguage];

export const getInventoryTranslation = (preferredLanguage) =>
  INVENTORY_LANGUAGE_SET[preferredLanguage] ||
  INVENTORY_LANGUAGE_SET[appDefaultLanguage];

export const getEmployeesTranslation = (preferredLanguage) =>
  EMPLOYEES_LANGUAGE_SET[preferredLanguage] ||
  EMPLOYEES_LANGUAGE_SET[appDefaultLanguage];

export const getLogoutTranslation = (preferredLanguage) =>
  LOGOUT_LANGUAGE_SET[preferredLanguage] ||
  LOGOUT_LANGUAGE_SET[appDefaultLanguage];

export const getNoPendingSignupRequestsTranslation = (preferredLanguage) =>
  NO_PENDING_SIGNUP_REQUESTS_LANGUAGE_SET[preferredLanguage] ||
  NO_PENDING_SIGNUP_REQUESTS_LANGUAGE_SET[appDefaultLanguage];

export const getEmailAlreadyInUseTranslation = (preferredLanguage) =>
  EMAIL_ALREADY_IN_USE_LANGUAGE_SET[preferredLanguage] ||
  EMAIL_ALREADY_IN_USE_LANGUAGE_SET[appDefaultLanguage];

export const getPasswordLengthErrorTranslation = (preferredLanguage) =>
  PASSWORD_LENGTH_ERROR_LANGUAGE_SET[preferredLanguage] ||
  PASSWORD_LENGTH_ERROR_LANGUAGE_SET[appDefaultLanguage];

export const getSignupErrorTranslation = (preferredLanguage) =>
  SIGNUP_ERROR_LANGUAGE_SET[preferredLanguage] ||
  SIGNUP_ERROR_LANGUAGE_SET[appDefaultLanguage];

export const getSuccessTranslation = (preferredLanguage) =>
  SUCCESS_LANGUAGE_SET[preferredLanguage] ||
  SUCCESS_LANGUAGE_SET[appDefaultLanguage];

export const getRequestApprovedSuccessTranslation = (preferredLanguage) =>
  REQUEST_APPROVED_SUCCESS_LANGUAGE_SET[preferredLanguage] ||
  REQUEST_APPROVED_SUCCESS_LANGUAGE_SET[appDefaultLanguage];

export const getFailedToApproveRequestTranslation = (preferredLanguage) =>
  FAILED_TO_APPROVE_REQUEST_LANGUAGE_SET[preferredLanguage] ||
  FAILED_TO_APPROVE_REQUEST_LANGUAGE_SET[appDefaultLanguage];
