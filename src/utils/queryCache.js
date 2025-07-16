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
                // Check if it's a network error that should be handled specially
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
                    // Check for expected service-specific errors
                    const errorMessage = error.message || error.toString();
                    const isExpectedServiceError =
                        (errorMessage.includes("lime-metrics") &&
                            (errorMessage.includes("No known Internet path") ||
                                errorMessage.includes("No gateway available") ||
                                errorMessage.includes("Not found") ||
                                errorMessage.includes(
                                    "No target specified"
                                ))) ||
                        (errorMessage.includes("pirania") &&
                            errorMessage.includes("Object not found"));

                    if (isExpectedServiceError) {
                        logger.warn("api", "Expected service error", {
                            error: errorMessage,
                        });
                    } else {
                        logger.error("api", "Query error", { error });
                    }
                }
            }
        },
    },
});

export default queryCache;
