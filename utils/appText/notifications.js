import { appDefaultLanguage } from "@/constants/appText/common";
import {
  NOTIFICATION_TITLE_LANGUAGE_SET,
  NOTIFICATION_CONTENT_LANGUAGE_SET,
} from "@/constants/appText/notifications";

export const getNotificationTitleTranslation = (preferredLanguage) => {
  return (
    NOTIFICATION_TITLE_LANGUAGE_SET[preferredLanguage] ||
    NOTIFICATION_TITLE_LANGUAGE_SET[appDefaultLanguage]
  );
};

export const getNotificationContentTranslation = (
  preferredLanguage,
  element
) => {
  const template =
    NOTIFICATION_CONTENT_LANGUAGE_SET[preferredLanguage] ||
    NOTIFICATION_CONTENT_LANGUAGE_SET[appDefaultLanguage];

  return template
    .replace("{name}", element.name)
    .replace("{tableNumber}", element.tableNumber.toString())
    .replace("{status}", element.status);
};
