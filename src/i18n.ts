import { i18n } from "@lingui/core";

// Load plural rules dynamically only when needed
export async function dynamicActivate(locale: Locales) {
    let catalog;
    let plurals;

    try {
        // Load messages with explicit imports to compiled files
        switch (locale) {
            case "en":
                catalog = await import("../i18n/en/messages");
                break;
            case "es":
                catalog = await import("../i18n/es/messages");
                break;
            case "pt":
                catalog = await import("../i18n/pt/messages");
                break;
            case "it":
                catalog = await import("../i18n/it/messages");
                break;
            default:
                // Fallback to English for unsupported locales
                catalog = await import("../i18n/en/messages");
                locale = "en";
        }

        // Try to load plural rules, but don't fail if unavailable
        try {
            const pluralModule = await import("make-plural/plurals");
            plurals = pluralModule[locale] || pluralModule.en;
            i18n.loadLocaleData({ [locale]: { plurals } });
        } catch (pluralError) {
            if (process.env.NODE_ENV !== "production") {
                console.warn(
                    `Plural rules not available for ${locale}, pluralization may not work correctly`
                );
            }
        }

        i18n.load(locale, catalog.messages || {});
        i18n.activate(locale);
    } catch (e) {
        // This will fail only during test, due to webpack config, which is expected
        if (process.env.NODE_ENV !== "production") {
            console.warn("Failed to load locale data for", locale, ":", e);
        }
        // Fallback to English with empty messages
        try {
            plurals = (await import("make-plural/plurals")).en;
            i18n.loadLocaleData({ en: { plurals } });
            i18n.load("en", {});
            i18n.activate("en");
        } catch (fallbackError) {
            if (process.env.NODE_ENV !== "production") {
                console.error("Failed to load fallback locale:", fallbackError);
            }
        }
    }
}

export default i18n;
