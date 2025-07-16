import { QueryClient } from "@tanstack/react-query";

import { logNetworkError, logger } from "./logger";

const queryCache = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: Infinity,
            refetchOnMount: false,
            retry: 0,
        },
    },
    logger: {
        log: console.log,
        warn: console.warn,
        // Enhanced error logging with centralized handling
        error: (error) => {
            // Skip logging in test environment (Jest sets NODE_ENV)
            if (
                typeof process !== "undefined" &&
                process.env &&
                process.env.NODE_ENV === "test"
            ) {
                return;
            }

            // Use centralized logging for query errors
            if (error && error !== undefined) {
                // First check for expected service-specific errors (higher priority)
                const errorMessage = error.message || error.toString();
                const isExpectedServiceError =
                    // lime-metrics expected errors (network topology states)
                    (errorMessage.includes("lime-metrics") &&
                        (errorMessage.includes("No known Internet path") ||
                            errorMessage.includes("No gateway available") ||
                            errorMessage.includes("Not found") ||
                            errorMessage.includes("No interface found") ||
                            errorMessage.includes("No target specified") ||
                            errorMessage.includes(
                                "No lime-proto-bmx6 or lime-proto-babeld found"
                            ))) ||
                    // pirania expected errors (captive portal states)
                    (errorMessage.includes("pirania") &&
                        errorMessage.includes("Object not found")) ||
                    // lime-utils expected errors (service states)
                    (errorMessage.includes("lime-utils") &&
                        (errorMessage.includes("No metadata available") ||
                            errorMessage.includes(
                                "No new version is available"
                            ) ||
                            errorMessage.includes(
                                "No new config available"
                            ))) ||
                    // lime-utils-admin expected errors (admin operations)
                    (errorMessage.includes("lime-utils-admin") &&
                        (errorMessage.includes("No metadata available") ||
                            errorMessage.includes(
                                "No new version is available"
                            ))) ||
                    // first-boot-wizard expected errors (setup states)
                    (errorMessage.includes("firstbootwizard") &&
                        (errorMessage.includes("error_not_configured") ||
                            errorMessage.includes("error_download")));

                if (isExpectedServiceError) {
                    logger.warn("api", "Expected service error", {
                        error: errorMessage,
                    });
                } else {
                    // Then check if it's a network error that should be handled specially
                    const isNetworkError =
                        error.status ||
                        error.endpoint ||
                        (error.message &&
                            (error.message.includes("Network error") ||
                                error.message.includes("HTTP error") ||
                                error.message.includes("Request failed")));

                    if (isNetworkError) {
                        // Use the network-specific logger which handles throttling
                        logNetworkError(error, error.endpoint);
                    } else {
                        logger.error("api", "Query error", { error });
                    }
                }
            }
        },
    },
});

export default queryCache;
