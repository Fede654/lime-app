import { QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/preact";

import { doSharedStateApiCall } from "components/shared-state/SharedStateApi";
import { usePublishAll } from "components/shared-state/SharedStateQueries";
import { sharedStateQueries } from "components/shared-state/SharedStateQueriesKeys";

import { useBoardData } from "utils/queries";
import queryCache from "utils/queryCache";

import { changeLocation } from "./locateApi";
import {
    useChangeLocation,
    useNodeInfoSharedState,
    useUpdateNodeLocationSharedState,
} from "./locateQueries";

// Mock the shared state dependencies
jest.mock("components/shared-state/SharedStateApi");
jest.mock("components/shared-state/SharedStateQueries");
jest.mock("components/shared-state/SharedStateQueriesKeys");
jest.mock("./locateApi");
jest.mock("utils/queries");

describe("Locate Queries - Shared State Integration", () => {
    const wrapper = ({ children }) => (
        <QueryClientProvider client={queryCache}>
            {children}
        </QueryClientProvider>
    );

    beforeEach(() => {
        // Reset all mocks
        act(() => queryCache.clear());
        jest.clearAllMocks();

        // Mock useBoardData to return sample board data
        useBoardData.mockReturnValue({
            data: {
                hostname: "test-node",
                board: "test-board",
                device: "test-device",
            },
        });

        // Mock usePublishAll to return a mock mutation
        usePublishAll.mockReturnValue({
            mutateAsync: jest.fn().mockResolvedValue({}),
        });

        // Mock sharedStateQueries
        sharedStateQueries.getFromSharedState.mockReturnValue([
            "shared-state-async",
            "get",
            { data_type: "node_info" },
        ]);
        sharedStateQueries.insertIntoReferenceState.mockReturnValue([
            "shared-state-async",
            "insert",
            { data_type: "node_info_ref", json: {} },
        ]);

        // Mock doSharedStateApiCall
        doSharedStateApiCall.mockResolvedValue({
            "test-node": {
                hostname: "test-node",
                bleachTTL: 300,
                author: "test-node",
                board: "test-board",
                device: "test-device",
                macs: [],
                ipv4: "10.13.0.1",
                ipv6: "",
                firmware_version: "test",
                uptime: 1000,
            },
        });

        // Mock changeLocation API
        changeLocation.mockResolvedValue({
            lat: "-31.4135",
            lon: "-64.1811",
        });
    });

    it("useNodeInfoSharedState should call shared state API", () => {
        const { result } = renderHook(() => useNodeInfoSharedState(), {
            wrapper,
        });

        expect(result.current.isLoading).toBeDefined();
        expect(sharedStateQueries.getFromSharedState).toHaveBeenCalledWith(
            "node_info"
        );
    });

    it("useUpdateNodeLocationSharedState should update node coordinates in shared state", async () => {
        const { result } = renderHook(
            () => useUpdateNodeLocationSharedState(),
            {
                wrapper,
            }
        );

        const testCoordinates = { lat: "-31.4135", long: "-64.1811" };

        await act(async () => {
            await result.current.mutateAsync({
                coordinates: testCoordinates,
            });
        });

        expect(doSharedStateApiCall).toHaveBeenCalledWith([
            "shared-state-async",
            "get",
            { data_type: "node_info" },
        ]);

        expect(
            sharedStateQueries.insertIntoReferenceState
        ).toHaveBeenCalledWith(
            "node_info",
            expect.objectContaining({
                "test-node": expect.objectContaining({
                    coordinates: testCoordinates,
                    hostname: "test-node",
                }),
            })
        );
    });

    it("useChangeLocation should integrate with shared state", async () => {
        const { result } = renderHook(() => useChangeLocation(), {
            wrapper,
        });

        const testParams = { lat: -31.4135, lon: -64.1811 };

        await act(async () => {
            await result.current.mutateAsync(testParams);
        });

        // Verify local API was called
        expect(changeLocation).toHaveBeenCalledWith(testParams);

        // Verify shared state integration was attempted
        expect(doSharedStateApiCall).toHaveBeenCalled();
        expect(usePublishAll).toHaveBeenCalled();
    });

    it("should handle coordinate format conversion (lon to long)", async () => {
        const { result } = renderHook(
            () => useUpdateNodeLocationSharedState(),
            {
                wrapper,
            }
        );

        const testCoordinates = { lat: "-31.4135", long: "-64.1811" };

        await act(async () => {
            await result.current.mutateAsync({
                coordinates: testCoordinates,
            });
        });

        expect(
            sharedStateQueries.insertIntoReferenceState
        ).toHaveBeenCalledWith(
            "node_info",
            expect.objectContaining({
                "test-node": expect.objectContaining({
                    coordinates: {
                        lat: "-31.4135",
                        long: "-64.1811", // Verify 'long' format is used
                    },
                }),
            })
        );
    });

    it("should handle errors gracefully in useChangeLocation", async () => {
        // Mock shared state failure
        doSharedStateApiCall.mockRejectedValueOnce(
            new Error("Shared state error")
        );

        const consoleSpy = jest.spyOn(console, "error").mockImplementation();

        const { result } = renderHook(() => useChangeLocation(), {
            wrapper,
        });

        const testParams = { lat: -31.4135, lon: -64.1811 };

        // Should not throw even if shared state fails
        await act(async () => {
            await result.current.mutateAsync(testParams);
        });

        expect(changeLocation).toHaveBeenCalledWith(testParams);
        expect(consoleSpy).toHaveBeenCalledWith(
            "Failed to update shared state or publish changes:",
            expect.any(Error)
        );

        consoleSpy.mockRestore();
    });
});
