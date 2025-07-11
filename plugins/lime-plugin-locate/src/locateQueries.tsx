/**
 * Locate Plugin Queries - Integration with LibreMesh Shared State
 *
 * This module implements issue #478: "Implement new set node location API"
 *
 * Key features:
 * - Integrates locate plugin with LibreMesh shared state system
 * - Enables mesh-wide location synchronization via publish_all
 * - Handles coordinate format conversion (lon ↔ long)
 * - Maintains backward compatibility with existing lime-location API
 * - Provides error handling for mesh synchronization failures
 *
 * Architecture:
 * - useChangeLocation: Enhanced to update both local and shared state
 * - useNodeInfoSharedState: Read mesh-wide node information including coordinates
 * - useUpdateNodeLocationSharedState: Update coordinates in shared state
 *
 * Coordinate format conversion:
 * - Local API uses: { lat: string, lon: string }
 * - Shared state uses: { lat: string, long: string }
 */
import { useMutation, useQuery } from "@tanstack/react-query";

import { doSharedStateApiCall } from "components/shared-state/SharedStateApi";
import { usePublishAll } from "components/shared-state/SharedStateQueries";
import { sharedStateQueries } from "components/shared-state/SharedStateQueriesKeys";

import { loadLeafLet } from "plugins/lime-plugin-locate/src/leafletUtils";
import {
    changeLocation,
    getLocation,
    getNodesandlinks,
} from "plugins/lime-plugin-locate/src/locateApi";
import { INodes } from "plugins/lime-plugin-mesh-wide/src/meshWideTypes";

import { useBoardData } from "utils/queries";
import queryCache from "utils/queryCache";

export interface INodeLocation {
    location: {
        lon: string;
        lat: string;
    };
    default: boolean;
}

export function useLocation(params) {
    return useQuery<INodeLocation>(["lime-location", "get"], getLocation, {
        placeholderData: {
            default: false,
            location: {
                lon: "FIXME",
                lat: "FIXME",
            },
        },
        ...params,
    });
}

export function useNodesandlinks(params) {
    return useQuery(
        ["lime-location", "all_nodes_and_links"],
        getNodesandlinks,
        {
            ...params,
        }
    );
}

interface IChangeUserParams {
    lat: number;
    lon: number;
}

export function useChangeLocation(params) {
    const updateSharedState = useUpdateNodeLocationSharedState();
    const publishAll = usePublishAll({ ip: "" }); // Will use current node IP

    return useMutation<
        { lat: string; lon: string },
        unknown,
        IChangeUserParams,
        unknown
    >({
        mutationFn: changeLocation,
        onSuccess: async (data: { lat: string; lon: string }) => {
            // Update local cache first
            queryCache.setQueryData(
                ["lime-location", "get"],
                (oldData: INodeLocation) =>
                    oldData
                        ? {
                              ...oldData,
                              location: {
                                  lat: data.lat,
                                  lon: data.lon,
                              },
                          }
                        : oldData
            );

            try {
                // Update shared state with coordinate format conversion (lon -> long)
                await updateSharedState.mutateAsync({
                    coordinates: {
                        lat: data.lat,
                        long: data.lon, // Convert lon to long for shared state
                    },
                });

                // Trigger publish_all to synchronize changes across the mesh
                await publishAll.mutateAsync({ ip: "" }); // Empty IP uses current node
            } catch (error) {
                console.error(
                    "Failed to update shared state or publish changes:",
                    error
                );
                // Note: We don't throw here to avoid breaking the local update
                // The location change succeeded locally even if mesh sync failed
            }
        },
        ...params,
    });
}

export function useLoadLeaflet(params) {
    // In development, Leaflet is bundled - always return success
    const isDev =
        process.env.NODE_ENV === "development" ||
        (typeof window !== "undefined" &&
            window.location.hostname === "localhost");

    // Always call useQuery but conditionally set enabled
    return useQuery(["lime-location", "load_leaflet"], loadLeafLet, {
        enabled: !isDev, // Only run query in production
        placeholderData: isDev ? true : undefined, // Return success in dev
        ...params,
    });
}

/**
 * Hook to get node_info data from shared state, which includes coordinates
 * This provides mesh-wide view of all nodes with their locations
 */
export function useNodeInfoSharedState(params = {}) {
    const dataType = "node_info";
    const queryKey = sharedStateQueries.getFromSharedState(dataType);

    return useQuery<INodes>(
        queryKey,
        () => doSharedStateApiCall<typeof dataType>(queryKey),
        {
            refetchInterval: 60000, // Refresh every minute
            staleTime: 30000, // Consider data stale after 30 seconds
            ...params,
        }
    );
}

/**
 * Hook to update node location in shared state
 * This integrates with the mesh-wide shared state system for coordinate synchronization
 */
export function useUpdateNodeLocationSharedState() {
    const { data: boardData } = useBoardData();

    return useMutation<
        any,
        unknown,
        { coordinates: { lat: string; long: string } },
        unknown
    >({
        mutationFn: async ({ coordinates }) => {
            if (!boardData?.hostname) {
                throw new Error(
                    "Board data not available - cannot update node location"
                );
            }

            // Get current node_info to preserve other data
            const currentNodeInfoQuery =
                sharedStateQueries.getFromSharedState("node_info");
            const currentNodeInfo = await doSharedStateApiCall<"node_info">(
                currentNodeInfoQuery
            );

            // Update only this node's coordinates while preserving other nodes
            const updatedNodeInfo = {
                ...currentNodeInfo,
                [boardData.hostname]: {
                    ...currentNodeInfo?.[boardData.hostname],
                    coordinates,
                    // Ensure we have required fields with defaults if missing
                    hostname: boardData.hostname,
                    bleachTTL:
                        currentNodeInfo?.[boardData.hostname]?.bleachTTL || 300,
                    author:
                        currentNodeInfo?.[boardData.hostname]?.author ||
                        boardData.hostname,
                    board:
                        currentNodeInfo?.[boardData.hostname]?.board ||
                        boardData.board ||
                        "unknown",
                    device:
                        currentNodeInfo?.[boardData.hostname]?.device ||
                        boardData.device ||
                        "unknown",
                    macs: currentNodeInfo?.[boardData.hostname]?.macs || [],
                    ipv4: currentNodeInfo?.[boardData.hostname]?.ipv4 || "",
                    ipv6: currentNodeInfo?.[boardData.hostname]?.ipv6 || "",
                    firmware_version:
                        currentNodeInfo?.[boardData.hostname]
                            ?.firmware_version || "",
                    uptime: currentNodeInfo?.[boardData.hostname]?.uptime || 0,
                },
            };

            // Insert updated data into shared state
            const insertQuery = sharedStateQueries.insertIntoReferenceState(
                "node_info",
                updatedNodeInfo
            );
            return doSharedStateApiCall<"node_info">(insertQuery);
        },
        onSuccess: () => {
            // Invalidate node_info queries to refresh UI
            queryCache.invalidateQueries({
                queryKey: sharedStateQueries.getFromSharedState("node_info"),
            });
        },
    });
}
