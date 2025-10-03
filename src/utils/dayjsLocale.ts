import dayjs from "dayjs";
import "dayjs/locale/vi";
import "dayjs/locale/en";
import i18n from "../i18n";

export const updateDayjsLocale = () => {
  const lang = i18n.language;
  if (lang === "vi") {
    dayjs.locale("vi");
  } else {
    dayjs.locale("en");
  }
};
