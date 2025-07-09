import { i18n } from "@lingui/core";

// Load plural rules dynamically only when needed
export async function dynamicActivate(locale: Locales) {
    let catalog;
    let plurals;

    try {
        // Load both messages and plurals dynamically
        catalog = await import(`@lingui/loader!../i18n/${locale}/messages.po`);

        // Load plural rules only for the needed locale
        switch (locale) {
            case "en":
                plurals = (await import("make-plural/plurals")).en;
                break;
            case "es":
                plurals = (await import("make-plural/plurals")).es;
                break;
            case "pt":
                plurals = (await import("make-plural/plurals")).pt;
                break;
            case "it":
                plurals = (await import("make-plural/plurals")).it;
                break;
            default:
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
