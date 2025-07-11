import { QueryClient } from "@tanstack/react-query";

const queryCache = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: Infinity,
            refetchOnMount: false,
            retry: 0,
        },
    },
    // Removed deprecated logger configuration for TanStack Query v4+
    // Use setLogger() method instead if custom logging is needed
});

export default queryCache;
