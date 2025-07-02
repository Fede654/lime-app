import { useLingui } from "@lingui/react";
import { useEffect, useState } from "preact/hooks";
import { format, register } from "timeago.js";

type TimeAgoProps = {
    timestamp: number;
};

const loadedLocales = new Set<string>();

export const TimeAgo = ({ timestamp }: TimeAgoProps) => {
    const { i18n } = useLingui();
    const [isLocaleLoaded, setIsLocaleLoaded] = useState(false);

    useEffect(() => {
        const loadLocale = async () => {
            if (i18n.locale === "en" || loadedLocales.has(i18n.locale)) {
                setIsLocaleLoaded(true);
                return;
            }

            try {
                let localeModule;
                switch (i18n.locale) {
                    case "es":
                        localeModule = await import(
                            "timeago.js/lib/lang/es.js"
                        );
                        break;
                    case "it":
                        localeModule = await import(
                            "timeago.js/lib/lang/it.js"
                        );
                        break;
                    case "pt":
                        localeModule = await import(
                            "timeago.js/lib/lang/pt_BR.js"
                        );
                        break;
                    default:
                        setIsLocaleLoaded(true);
                        return;
                }

                register(i18n.locale, localeModule.default);
                loadedLocales.add(i18n.locale);
                setIsLocaleLoaded(true);
            } catch (error) {
                console.warn(
                    `Failed to load timeago locale ${i18n.locale}:`,
                    error
                );
                setIsLocaleLoaded(true);
            }
        };

        loadLocale();
    }, [i18n.locale]);

    if (!isLocaleLoaded) {
        return format(timestamp * 1000, "en");
    }

    return format(timestamp * 1000, i18n.locale);
};

export default TimeAgo;
