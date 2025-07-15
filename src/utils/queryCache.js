import { QueryClient } from "@tanstack/react-query";

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
        // ✅ no more errors on the console for tests
        error: (error) => {
            // Skip logging in test environment (Jest sets NODE_ENV)
            if (
                typeof process !== "undefined" &&
                process.env &&
                process.env.NODE_ENV === "test"
            ) {
                return;
            }

            // Only log if error is meaningful and not expected development errors
            if (error && error !== undefined) {
                // Better error message extraction
                let errorMessage = "Unknown error";

                if (typeof error === "string") {
                    errorMessage = error;
                } else if (error.message) {
                    errorMessage = error.message;
                } else if (
                    error.toString &&
                    error.toString() !== "[object Object]"
                ) {
                    errorMessage = error.toString();
                } else {
                    // If it's an object without a useful toString, stringify it
                    try {
                        errorMessage = JSON.stringify(error);
                    } catch (e) {
                        errorMessage = "Unparseable error object";
                    }
                }

                // Filter out common expected errors in development mode
                const isExpectedError =
                    errorMessage.includes(
                        "Network error or server unreachable"
                    ) ||
                    errorMessage.includes("HTTP error! status: 500") ||
                    errorMessage.includes("Request failed") ||
                    // Only specific expected service errors
                    (errorMessage.includes("lime-metrics") &&
                        errorMessage.includes("No known Internet path")) ||
                    (errorMessage.includes("pirania") &&
                        errorMessage.includes("Object not found"));

                if (!isExpectedError) {
                    console.error(error);
                } else {
                    // Extract just the error part after the context prefix
                    const parts = errorMessage.split("] ");
                    const cleanMessage =
                        parts.length > 1 ? parts[1] : errorMessage;
                    console.warn(`API Error: ${cleanMessage}`);
                }
            }
        },
    },
});

export default queryCache;
