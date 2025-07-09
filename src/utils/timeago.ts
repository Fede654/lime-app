/**
 * Lightweight time ago utility
 * Replacement for timeago.js to reduce bundle size
 */

interface TimeAgoLocale {
    [key: string]: [string, string]; // [past, future]
}

const locales: { [key: string]: TimeAgoLocale } = {
    en: {
        second: ["just now", "just now"],
        minute: ["1 minute ago", "in 1 minute"],
        minutes: ["%s minutes ago", "in %s minutes"],
        hour: ["1 hour ago", "in 1 hour"],
        hours: ["%s hours ago", "in %s hours"],
        day: ["1 day ago", "in 1 day"],
        days: ["%s days ago", "in %s days"],
        week: ["1 week ago", "in 1 week"],
        weeks: ["%s weeks ago", "in %s weeks"],
        month: ["1 month ago", "in 1 month"],
        months: ["%s months ago", "in %s months"],
        year: ["1 year ago", "in 1 year"],
        years: ["%s years ago", "in %s years"],
    },
    es: {
        second: ["justo ahora", "justo ahora"],
        minute: ["hace 1 minuto", "en 1 minuto"],
        minutes: ["hace %s minutos", "en %s minutos"],
        hour: ["hace 1 hora", "en 1 hora"],
        hours: ["hace %s horas", "en %s horas"],
        day: ["hace 1 día", "en 1 día"],
        days: ["hace %s días", "en %s días"],
        week: ["hace 1 semana", "en 1 semana"],
        weeks: ["hace %s semanas", "en %s semanas"],
        month: ["hace 1 mes", "en 1 mes"],
        months: ["hace %s meses", "en %s meses"],
        year: ["hace 1 año", "en 1 año"],
        years: ["hace %s años", "en %s años"],
    },
    it: {
        second: ["proprio ora", "proprio ora"],
        minute: ["1 minuto fa", "tra 1 minuto"],
        minutes: ["%s minuti fa", "tra %s minuti"],
        hour: ["1 ora fa", "tra 1 ora"],
        hours: ["%s ore fa", "tra %s ore"],
        day: ["1 giorno fa", "tra 1 giorno"],
        days: ["%s giorni fa", "tra %s giorni"],
        week: ["1 settimana fa", "tra 1 settimana"],
        weeks: ["%s settimane fa", "tra %s settimane"],
        month: ["1 mese fa", "tra 1 mese"],
        months: ["%s mesi fa", "tra %s mesi"],
        year: ["1 anno fa", "tra 1 anno"],
        years: ["%s anni fa", "tra %s anni"],
    },
    pt: {
        second: ["agora mesmo", "agora mesmo"],
        minute: ["há 1 minuto", "em 1 minuto"],
        minutes: ["há %s minutos", "em %s minutos"],
        hour: ["há 1 hora", "em 1 hora"],
        hours: ["há %s horas", "em %s horas"],
        day: ["há 1 dia", "em 1 dia"],
        days: ["há %s dias", "em %s dias"],
        week: ["há 1 semana", "em 1 semana"],
        weeks: ["há %s semanas", "em %s semanas"],
        month: ["há 1 mês", "em 1 mês"],
        months: ["há %s meses", "em %s meses"],
        year: ["há 1 ano", "em 1 ano"],
        years: ["há %s anos", "em %s anos"],
    },
};

/**
 * Format a timestamp to a human-readable "time ago" string
 * @param timestamp - Timestamp in milliseconds
 * @param locale - Language locale (en, es, it, pt)
 * @returns Human-readable time ago string
 */
export function format(timestamp: number, locale = "en"): string {
    const now = Date.now();
    const diff = now - timestamp;
    const future = diff < 0;
    const absDiff = Math.abs(diff);

    // Get locale or fallback to English
    const loc = locales[locale] || locales.en;

    // Time units in milliseconds
    const units = [
        { name: "year", value: 31536000000 },
        { name: "month", value: 2592000000 },
        { name: "week", value: 604800000 },
        { name: "day", value: 86400000 },
        { name: "hour", value: 3600000 },
        { name: "minute", value: 60000 },
        { name: "second", value: 1000 },
    ];

    // Find the appropriate unit
    for (const unit of units) {
        const count = Math.floor(absDiff / unit.value);
        if (count >= 1) {
            const key = count === 1 ? unit.name : `${unit.name}s`;
            const template = loc[key];
            if (template) {
                const text = template[future ? 1 : 0];
                return text.replace("%s", count.toString());
            }
        }
    }

    // Less than a second
    const template = loc.second;
    return template[future ? 1 : 0];
}

/**
 * Compatibility function for timeago.js register - no-op in our implementation
 * @param locale - Locale identifier
 * @param localeData - Locale data (ignored in our implementation)
 */
export function register(locale: string, localeData: any): void {
    // No-op for compatibility with timeago.js API
    // Our implementation has built-in locales
}

export default { format, register };
