import { i18n } from "@lingui/core";

// Load plural rules dynamically only when needed
export async function dynamicActivate(locale: Locales) {
    let catalog;
    let plurals;

    try {
        // Load messages and plurals with explicit imports to prevent empty chunks
        switch (locale) {
            case "en":
                catalog = await import("@lingui/loader!../i18n/en/messages.po");
                plurals = (await import("make-plural/plurals")).en;
                break;
            case "es":
                catalog = await import("@lingui/loader!../i18n/es/messages.po");
                plurals = (await import("make-plural/plurals")).es;
                break;
            case "pt":
                catalog = await import("@lingui/loader!../i18n/pt/messages.po");
                plurals = (await import("make-plural/plurals")).pt;
                break;
            case "it":
                catalog = await import("@lingui/loader!../i18n/it/messages.po");
                plurals = (await import("make-plural/plurals")).it;
                break;
            default:
                // Fallback to English for unsupported locales
                catalog = await import("@lingui/loader!../i18n/en/messages.po");
                plurals = (await import("make-plural/plurals")).en;
        }

        i18n.loadLocaleData({ [locale]: { plurals } });
        i18n.load(locale, catalog.messages);
        i18n.activate(locale);
    } catch (e) {
        // This will fail only during test, due to webpack config, which is expected
        console.warn("Failed to load locale data for", locale, ":", e);
        // Fallback to English with empty messages
        try {
            plurals = (await import("make-plural/plurals")).en;
            i18n.loadLocaleData({ en: { plurals } });
            i18n.load("en", {});
            i18n.activate("en");
        } catch (fallbackError) {
            console.error("Failed to load fallback locale:", fallbackError);
        }
    }
}

export default i18n;
