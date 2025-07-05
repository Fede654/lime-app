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
            const mockConfig = { enabled: true };
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
            await waitFor(() => {
                expect(result.current.data).toBeUndefined();
            });
            expect(getGroundRoutingPromise).not.toHaveBeenCalled();
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
                expect(setGroundRoutingPromise).toHaveBeenCalledWith(
                    testConfig
                );
            });

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
                expect(setGroundRoutingPromise).toHaveBeenCalledWith(newConfig);
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
                expect(setGroundRoutingPromise).toHaveBeenCalled();
            });

            await waitFor(() => {
                expect(result.current.isError).toBe(true);
            });

            expect(result.current.error).toEqual(error);
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
                expect(setGroundRoutingPromise).toHaveBeenCalledWith({
                    enabled: true,
                });
            });

            // Second mutation
            act(() => {
                result.current.mutate({ enabled: false });
            });

            await waitFor(() => {
                expect(setGroundRoutingPromise).toHaveBeenCalledTimes(2);
            });

            expect(setGroundRoutingPromise).toHaveBeenNthCalledWith(1, {
                enabled: true,
            });
            expect(setGroundRoutingPromise).toHaveBeenNthCalledWith(2, {
                enabled: false,
            });
        });
    });
});
