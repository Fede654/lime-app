import { QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/preact";

import queryCache from "utils/queryCache";

import {
    getGroundRoutingPromise,
    setGroundRoutingPromise,
} from "./groundRoutingApi";
import { useGroundRouting, useSetGroundRouting } from "./groundRoutingQueries";

jest.mock("./groundRoutingApi");

describe("groundRoutingQueries", () => {
    const wrapper = ({ children }) => (
        <QueryClientProvider client={queryCache}>
            {children}
        </QueryClientProvider>
    );

    beforeEach(() => {
        act(() => queryCache.clear());
        jest.clearAllMocks();
    });

    describe("useGroundRouting", () => {
        it("calls getGroundRoutingPromise and returns data", async () => {
            const mockConfig = {
                enabled: true,
                interfaces: ["eth0", "eth1"],
            };
            getGroundRoutingPromise.mockResolvedValue(mockConfig);

            const { result } = renderHook(() => useGroundRouting(), {
                wrapper,
            });

            expect(result.current.isLoading).toBe(true);
            expect(result.current.data).toBeUndefined();

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.data).toEqual(mockConfig);
            expect(result.current.isError).toBe(false);
            expect(getGroundRoutingPromise).toHaveBeenCalledTimes(1);
        });

        it("handles API errors", async () => {
            const error = new Error("API Error");
            getGroundRoutingPromise.mockRejectedValue(error);

            const { result } = renderHook(() => useGroundRouting(), {
                wrapper,
            });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.isError).toBe(true);
            expect(result.current.data).toBeUndefined();
            expect(result.current.error).toEqual(error);
        });

        it("uses correct query key", async () => {
            const mockConfig = { enabled: false };
            getGroundRoutingPromise.mockResolvedValue(mockConfig);

            renderHook(() => useGroundRouting(), { wrapper });

            await waitFor(() => {
                expect(getGroundRoutingPromise).toHaveBeenCalled();
            });

            // Check that the data is cached with the correct key
            const cachedData = queryCache.getQueryData([
                "lime-groundrouting",
                "get",
            ]);
            expect(cachedData).toEqual(mockConfig);
        });

        it("accepts custom query config", async () => {
            const mockConfig = { enabled: true };
            getGroundRoutingPromise.mockResolvedValue(mockConfig);

            const customConfig = {
                enabled: false,
                staleTime: 5000,
            };

            const { result } = renderHook(
                () => useGroundRouting(customConfig),
                { wrapper }
            );

            // Query should not run due to enabled: false
            expect(result.current.isLoading).toBe(false);
            expect(result.current.data).toBeUndefined();
            expect(getGroundRoutingPromise).not.toHaveBeenCalled();
        });

        it("handles empty config response", async () => {
            const mockConfig = {};
            getGroundRoutingPromise.mockResolvedValue(mockConfig);

            const { result } = renderHook(() => useGroundRouting(), {
                wrapper,
            });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.data).toEqual({});
            expect(result.current.isError).toBe(false);
        });

        it("refetches data when query is invalidated", async () => {
            const mockConfig1 = { enabled: true, version: 1 };
            const mockConfig2 = { enabled: false, version: 2 };

            getGroundRoutingPromise
                .mockResolvedValueOnce(mockConfig1)
                .mockResolvedValueOnce(mockConfig2);

            const { result } = renderHook(() => useGroundRouting(), {
                wrapper,
            });

            await waitFor(() => {
                expect(result.current.data).toEqual(mockConfig1);
            });

            // Invalidate the query
            act(() => {
                queryCache.invalidateQueries(["lime-groundrouting", "get"]);
            });

            await waitFor(() => {
                expect(result.current.data).toEqual(mockConfig2);
            });

            expect(getGroundRoutingPromise).toHaveBeenCalledTimes(2);
        });

        it("provides refetch function", async () => {
            const mockConfig = { enabled: true };
            getGroundRoutingPromise.mockResolvedValue(mockConfig);

            const { result } = renderHook(() => useGroundRouting(), {
                wrapper,
            });

            await waitFor(() => {
                expect(result.current.data).toEqual(mockConfig);
            });

            expect(typeof result.current.refetch).toBe("function");

            // Test refetch functionality
            const mockConfig2 = { enabled: false };
            getGroundRoutingPromise.mockResolvedValue(mockConfig2);

            act(() => {
                result.current.refetch();
            });

            await waitFor(() => {
                expect(result.current.data).toEqual(mockConfig2);
            });

            expect(getGroundRoutingPromise).toHaveBeenCalledTimes(2);
        });
    });

    describe("useSetGroundRouting", () => {
        it("calls setGroundRoutingPromise when mutate is called", async () => {
            const mockResponse = { success: true };
            setGroundRoutingPromise.mockResolvedValue(mockResponse);

            const { result } = renderHook(() => useSetGroundRouting(), {
                wrapper,
            });

            const testConfig = { enabled: true, interfaces: ["eth0"] };

            act(() => {
                result.current.mutate(testConfig);
            });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(setGroundRoutingPromise).toHaveBeenCalledWith(testConfig);
            expect(result.current.data).toEqual(mockResponse);
            expect(result.current.isError).toBe(false);
        });

        it("invalidates ground routing cache on successful mutation", async () => {
            const mockResponse = { success: true };
            setGroundRoutingPromise.mockResolvedValue(mockResponse);

            // First, set some initial data in the cache
            const initialConfig = { enabled: false };
            queryCache.setQueryData(
                ["lime-groundrouting", "get"],
                initialConfig
            );

            const { result } = renderHook(() => useSetGroundRouting(), {
                wrapper,
            });

            const newConfig = { enabled: true, interfaces: ["eth0"] };

            // Spy on invalidateQueries
            const invalidateSpy = jest.spyOn(queryCache, "invalidateQueries");

            act(() => {
                result.current.mutate(newConfig);
            });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            // Check that invalidateQueries was called with the correct key
            expect(invalidateSpy).toHaveBeenCalledWith([
                "lime-groundrouting",
                "get",
            ]);
        });

        it("handles mutation errors", async () => {
            const error = new Error("Save failed");
            setGroundRoutingPromise.mockRejectedValue(error);

            const { result } = renderHook(() => useSetGroundRouting(), {
                wrapper,
            });

            act(() => {
                result.current.mutate({ enabled: true });
            });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.isError).toBe(true);
            expect(result.current.error).toEqual(error);
        });

        it("shows loading state during mutation", async () => {
            // Mock a slow mutation
            setGroundRoutingPromise.mockImplementation(
                () =>
                    new Promise((resolve) =>
                        setTimeout(() => resolve({ success: true }), 100)
                    )
            );

            const { result } = renderHook(() => useSetGroundRouting(), {
                wrapper,
            });

            act(() => {
                result.current.mutate({ enabled: true });
            });

            // Should be loading immediately after mutation starts
            expect(result.current.isLoading).toBe(true);

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });
        });

        it("handles empty config mutation", async () => {
            const mockResponse = { success: true };
            setGroundRoutingPromise.mockResolvedValue(mockResponse);

            const { result } = renderHook(() => useSetGroundRouting(), {
                wrapper,
            });

            act(() => {
                result.current.mutate({});
            });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(setGroundRoutingPromise).toHaveBeenCalledWith({});
            expect(result.current.data).toEqual(mockResponse);
        });

        it("handles complex config mutation", async () => {
            const mockResponse = {
                success: true,
                message: "Configuration saved",
            };
            setGroundRoutingPromise.mockResolvedValue(mockResponse);

            const { result } = renderHook(() => useSetGroundRouting(), {
                wrapper,
            });

            const complexConfig = {
                global: { enabled: true, debug: false },
                interfaces: {
                    eth0: { metric: 100, gateway: "192.168.1.1" },
                    eth1: { metric: 200 },
                },
                routes: [{ destination: "0.0.0.0/0", gateway: "192.168.1.1" }],
            };

            act(() => {
                result.current.mutate(complexConfig);
            });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(setGroundRoutingPromise).toHaveBeenCalledWith(complexConfig);
            expect(result.current.data).toEqual(mockResponse);
        });

        it("can be called multiple times", async () => {
            const mockResponse = { success: true };
            setGroundRoutingPromise.mockResolvedValue(mockResponse);

            const { result } = renderHook(() => useSetGroundRouting(), {
                wrapper,
            });

            // First mutation
            act(() => {
                result.current.mutate({ enabled: true });
            });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            // Second mutation
            act(() => {
                result.current.mutate({ enabled: false });
            });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(setGroundRoutingPromise).toHaveBeenCalledTimes(2);
            expect(setGroundRoutingPromise).toHaveBeenNthCalledWith(1, {
                enabled: true,
            });
            expect(setGroundRoutingPromise).toHaveBeenNthCalledWith(2, {
                enabled: false,
            });
        });
    });
});
