import { QueryClient } from "@tanstack/react-query";

// Wrapper function to ensure no undefined values reach TanStack Query
const safeQueryFn = (originalQueryFn) => {
    return async (...args) => {
        try {
            const result = await originalQueryFn(...args);

            // If result is undefined or null, throw a proper error instead
            if (result === undefined) {
                // Provide context based on the query key if available
                const queryKey = args[0]?.queryKey || args[0] || "unknown";
                const keyStr = Array.isArray(queryKey)
                    ? queryKey.join(".")
                    : String(queryKey);
                throw new Error(
                    `Query '${keyStr}' returned undefined - API service may be unavailable`
                );
            }
            if (result === null) {
                const queryKey = args[0]?.queryKey || args[0] || "unknown";
                const keyStr = Array.isArray(queryKey)
                    ? queryKey.join(".")
                    : String(queryKey);
                throw new Error(
                    `Query '${keyStr}' returned null - service may be down`
                );
            }

            return result;
        } catch (error) {
            // If error is undefined, convert it to a proper Error object
            if (error === undefined) {
                const queryKey = args[0]?.queryKey || args[0] || "unknown";
                const keyStr = Array.isArray(queryKey)
                    ? queryKey.join(".")
                    : String(queryKey);
                throw new Error(
                    `Unknown error in query '${keyStr}' - error was undefined`
                );
            }
            if (error === null) {
                throw new Error("Null error occurred in query");
            }
            // Re-throw proper errors as-is
            throw error;
        }
    };
};

const queryCache = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: Infinity,
            refetchOnMount: false,
            retry: 0,
            onError: (error) => {
                // Handle errors gracefully - but this should now only receive proper Error objects
                if (error === undefined) {
                    console.debug(
                        "Query error: undefined (this should not happen with safeQueryFn)"
                    );
                } else if (error && error.message) {
                    console.debug("Query failed:", error.message);
                } else if (error) {
                    console.debug("Query failed:", error);
                }
            },
        },
        mutations: {
            onError: (error) => {
                // Handle mutation errors gracefully
                if (error === undefined) {
                    console.debug(
                        "Mutation error: undefined (this should not happen)"
                    );
                } else if (error && error.message) {
                    console.debug("Mutation failed:", error.message);
                } else if (error) {
                    console.debug("Mutation failed:", error);
                }
            },
        },
    },
});

// Helper function to wrap query functions safely
export const createSafeQuery = (queryFn) => safeQueryFn(queryFn);

export default queryCache;
