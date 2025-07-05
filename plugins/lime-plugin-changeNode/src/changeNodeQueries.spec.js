import { QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/preact";

import queryCache from "utils/queryCache";

import { getCloudNodesPromise } from "./changeNodeApi";
import { useCloudNodes } from "./changeNodeQueries";

jest.mock("./changeNodeApi");

describe("changeNodeQueries", () => {
    beforeEach(() => {
        act(() => queryCache.clear());
        jest.clearAllMocks();
    });

    describe("useCloudNodes", () => {
        it("calls getCloudNodesPromise and returns data", async () => {
            const mockNodes = ["node1", "node2", "node3"];
            getCloudNodesPromise.mockResolvedValue(mockNodes);

            const { result } = renderHook(() => useCloudNodes(), {
                wrapper: ({ children }) => (
                    <QueryClientProvider client={queryCache}>
                        {children}
                    </QueryClientProvider>
                ),
            });

            expect(result.current.isLoading).toBe(true);
            expect(result.current.data).toBeUndefined();

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.data).toEqual(mockNodes);
            expect(result.current.isError).toBe(false);
            expect(getCloudNodesPromise).toHaveBeenCalledTimes(1);
        });

        it("handles API errors", async () => {
            const error = new Error("API Error");
            getCloudNodesPromise.mockRejectedValue(error);

            const { result } = renderHook(() => useCloudNodes(), {
                wrapper: ({ children }) => (
                    <QueryClientProvider client={queryCache}>
                        {children}
                    </QueryClientProvider>
                ),
            });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.isError).toBe(true);
            expect(result.current.data).toBeUndefined();
            expect(result.current.error).toEqual(error);
        });

        it("uses correct query key", async () => {
            const mockNodes = ["node1"];
            getCloudNodesPromise.mockResolvedValue(mockNodes);

            renderHook(() => useCloudNodes(), {
                wrapper: ({ children }) => (
                    <QueryClientProvider client={queryCache}>
                        {children}
                    </QueryClientProvider>
                ),
            });

            await waitFor(() => {
                expect(getCloudNodesPromise).toHaveBeenCalled();
            });

            // Check that the data is cached with the correct key
            const cachedData = queryCache.getQueryData([
                "lime-utils",
                "get_cloud_nodes",
            ]);
            expect(cachedData).toEqual(mockNodes);
        });

        it("accepts custom query config", async () => {
            const mockNodes = ["node1"];
            getCloudNodesPromise.mockResolvedValue(mockNodes);

            const customConfig = {
                enabled: false,
                staleTime: 5000,
            };

            const { result } = renderHook(() => useCloudNodes(customConfig), {
                wrapper: ({ children }) => (
                    <QueryClientProvider client={queryCache}>
                        {children}
                    </QueryClientProvider>
                ),
            });

            // With enabled: false, the query should not execute
            await waitFor(() => {
                expect(result.current.data).toBeUndefined();
            });

            expect(getCloudNodesPromise).not.toHaveBeenCalled();
        });

        it("refetches data when query is invalidated", async () => {
            const mockNodes1 = ["node1", "node2"];
            const mockNodes2 = ["node1", "node2", "node3"];

            getCloudNodesPromise
                .mockResolvedValueOnce(mockNodes1)
                .mockResolvedValueOnce(mockNodes2);

            const { result } = renderHook(() => useCloudNodes(), {
                wrapper: ({ children }) => (
                    <QueryClientProvider client={queryCache}>
                        {children}
                    </QueryClientProvider>
                ),
            });

            await waitFor(() => {
                expect(result.current.data).toEqual(mockNodes1);
            });

            // Invalidate the query
            act(() => {
                queryCache.invalidateQueries(["lime-utils", "get_cloud_nodes"]);
            });

            await waitFor(() => {
                expect(result.current.data).toEqual(mockNodes2);
            });

            expect(getCloudNodesPromise).toHaveBeenCalledTimes(2);
        });
    });
});
