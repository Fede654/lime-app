import api from "utils/uhttpd.service";

import { getCloudNodesPromise } from "./changeNodeApi";

jest.mock("utils/uhttpd.service");

describe("changeNodeApi", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getCloudNodesPromise", () => {
        it("calls the correct ubus endpoint", async () => {
            const mockResponse = {
                nodes: {
                    mesh1: ["node1", "node2"],
                    mesh2: ["node3", "node4"],
                },
            };

            api.call.mockResolvedValue(mockResponse);

            await getCloudNodesPromise();

            expect(api.call).toHaveBeenCalledWith(
                "lime-utils",
                "get_cloud_nodes",
                {}
            );
        });

        it("transforms response data correctly", async () => {
            const mockResponse = {
                nodes: {
                    mesh1: ["node1", "node2"],
                    mesh2: ["node3", "node4"],
                },
            };

            api.call.mockResolvedValue(mockResponse);

            const result = await getCloudNodesPromise();

            // Should flatten all nodes into a single array
            expect(result).toEqual(["node1", "node2", "node3", "node4"]);
        });

        it("handles empty nodes object", async () => {
            const mockResponse = {
                nodes: {},
            };

            api.call.mockResolvedValue(mockResponse);

            const result = await getCloudNodesPromise();

            expect(result).toEqual([]);
        });

        it("handles response without nodes property", async () => {
            const mockResponse = {};

            api.call.mockResolvedValue(mockResponse);

            await expect(getCloudNodesPromise()).rejects.toThrow(
                "Cannot convert undefined or null to object"
            );
        });

        it("handles API errors", async () => {
            const error = new Error("Network error");
            api.call.mockRejectedValue(error);

            await expect(getCloudNodesPromise()).rejects.toThrow(
                "Network error"
            );
        });

        it("handles complex nested structure", async () => {
            const mockResponse = {
                nodes: {
                    mesh_west: ["node-west-1", "node-west-2"],
                    mesh_east: ["node-east-1"],
                    mesh_central: [
                        "node-central-1",
                        "node-central-2",
                        "node-central-3",
                    ],
                },
            };

            api.call.mockResolvedValue(mockResponse);

            const result = await getCloudNodesPromise();

            expect(result).toEqual([
                "node-west-1",
                "node-west-2",
                "node-east-1",
                "node-central-1",
                "node-central-2",
                "node-central-3",
            ]);
        });
    });
});
