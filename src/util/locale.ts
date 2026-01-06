import { CalendarLocale } from "src/redux/setting";

export const getMomentLocaleName = (
    locale: CalendarLocale | undefined
): string | null => {
    switch (locale) {
        case CalendarLocale.zh_CN:
            return "zh-cn";
        case CalendarLocale.en_US:
            return "en";
        case CalendarLocale.en_GB:
            return "en-gb";
        default:
            return null;
    }
};
