/**
 * Centralized logging utility with context-aware levels and throttling
 * Provides better developer experience and reduces console spam
 */

type LogLevel = "debug" | "info" | "warn" | "error";
type LogContext = "network" | "auth" | "ui" | "api" | "general";

class Logger {
    private errorThrottle = new Map<string, number>();
    private readonly THROTTLE_DURATION = 5000; // 5 seconds
    private readonly isDevelopment = process.env.NODE_ENV !== "production";

    private shouldThrottle(key: string): boolean {
        const now = Date.now();
        const lastLogged = this.errorThrottle.get(key);

        if (!lastLogged || now - lastLogged > this.THROTTLE_DURATION) {
            this.errorThrottle.set(key, now);
            return false;
        }
        return true;
    }

    private formatMessage(context: LogContext, message: string): string {
        const contextEmojis = {
            network: "🌐",
            auth: "🔐",
            ui: "🎨",
            api: "📡",
            general: "📝",
        };

        return `${
            contextEmojis[context]
        } [${context.toUpperCase()}] ${message}`;
    }

    private getConsoleMethod(level: LogLevel) {
        switch (level) {
            case "debug":
                return console.debug;
            case "info":
                return console.info;
            case "warn":
                return console.warn;
            case "error":
                return console.error;
            default:
                return console.log;
        }
    }

    debug(context: LogContext, message: string, data?: unknown) {
        if (this.isDevelopment) {
            this.log("debug", context, message, data);
        }
    }

    info(context: LogContext, message: string, data?: unknown) {
        this.log("info", context, message, data);
    }

    warn(context: LogContext, message: string, data?: unknown) {
        this.log("warn", context, message, data);
    }

    error(context: LogContext, message: string, data?: unknown) {
        this.log("error", context, message, data);
    }

    // Network-specific logging with smart context
    networkError(error: unknown, endpoint?: string) {
        // Type guard for error object
        const errorObj = error as {
            status?: number;
            name?: string;
            message?: string;
        };

        const isTimeoutOrUnavailable =
            errorObj.status === 504 ||
            errorObj.status === 503 ||
            errorObj.name === "AbortError" ||
            errorObj.message?.includes("ECONNREFUSED");

        if (isTimeoutOrUnavailable && this.isDevelopment) {
            const throttleKey = `network_unavailable_${endpoint || "unknown"}`;
            if (this.shouldThrottle(throttleKey)) {
                return; // Skip spammy network errors
            }

            this.warn(
                "network",
                `Backend unavailable${
                    endpoint ? ` for ${endpoint}` : ""
                } (expected in development without router)`,
                { error: errorObj.message, status: errorObj.status }
            );
        } else {
            // Real network errors that should be shown
            this.error(
                "network",
                `Network request failed${endpoint ? ` for ${endpoint}` : ""}`,
                { error: errorObj.message, status: errorObj.status }
            );
        }
    }

    // Auth-specific logging
    authEvent(
        event:
            | "login_attempt"
            | "login_success"
            | "login_failure"
            | "logout"
            | "auto_login",
        details?: unknown
    ) {
        const messages = {
            login_attempt: "🔄 Attempting authentication...",
            login_success: "✅ Authentication successful",
            login_failure: "❌ Authentication failed",
            logout: "👋 User logged out",
            auto_login: "🔄 Attempting guest access...",
        };

        const level = event.includes("failure") ? "warn" : "info";
        this.log(level, "auth", messages[event], details);
    }

    private log(
        level: LogLevel,
        context: LogContext,
        message: string,
        data?: unknown
    ) {
        const formattedMessage = this.formatMessage(context, message);
        const consoleMethod = this.getConsoleMethod(level);

        if (data) {
            consoleMethod(formattedMessage, data);
        } else {
            consoleMethod(formattedMessage);
        }
    }
}

// Export singleton instance
export const logger = new Logger();

// Convenience exports for common patterns
export const logNetworkError = (error: unknown, endpoint?: string) =>
    logger.networkError(error, endpoint);
export const logAuthEvent = (
    event: Parameters<typeof logger.authEvent>[0],
    details?: unknown
) => logger.authEvent(event, details);
