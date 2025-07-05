import api from "utils/uhttpd.service";

import {
    getGroundRoutingPromise,
    setGroundRoutingPromise,
} from "./groundRoutingApi";

jest.mock("utils/uhttpd.service");

describe("groundRoutingApi", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getGroundRoutingPromise", () => {
        it("calls the correct ubus endpoint", async () => {
            const mockResponse = {
                config: {
                    enabled: true,
                    interfaces: ["eth0"],
                },
            };

            api.call.mockResolvedValue(mockResponse);

            await getGroundRoutingPromise();

            expect(api.call).toHaveBeenCalledWith(
                "lime-groundrouting",
                "get",
                {}
            );
        });

        it("returns config from response", async () => {
            const mockConfig = {
                enabled: true,
                interfaces: ["eth0", "eth1"],
                routing_table: "main",
            };
            const mockResponse = {
                config: mockConfig,
            };

            api.call.mockResolvedValue(mockResponse);

            const result = await getGroundRoutingPromise();

            expect(result).toEqual(mockConfig);
        });

        it("handles empty config", async () => {
            const mockResponse = {
                config: {},
            };

            api.call.mockResolvedValue(mockResponse);

            const result = await getGroundRoutingPromise();

            expect(result).toEqual({});
        });

        it("throws error when config property is missing", async () => {
            const mockResponse = {};

            api.call.mockResolvedValue(mockResponse);

            await expect(getGroundRoutingPromise()).rejects.toThrow(
                "Ground routing config not found"
            );
        });

        it("throws error when config property is undefined", async () => {
            const mockResponse = {
                config: undefined,
            };

            api.call.mockResolvedValue(mockResponse);

            await expect(getGroundRoutingPromise()).rejects.toThrow(
                "Ground routing config not found"
            );
        });

        it("handles API errors", async () => {
            const error = new Error("Network error");
            api.call.mockRejectedValue(error);

            await expect(getGroundRoutingPromise()).rejects.toThrow(
                "Network error"
            );
        });

        it("handles complex nested config", async () => {
            const mockConfig = {
                global: {
                    enabled: true,
                    debug: false,
                },
                interfaces: {
                    ethernet: {
                        eth0: { metric: 100 },
                        eth1: { metric: 200 },
                    },
                },
                routing: {
                    default_gateway: "192.168.1.1",
                    custom_routes: [],
                },
            };
            const mockResponse = {
                config: mockConfig,
            };

            api.call.mockResolvedValue(mockResponse);

            const result = await getGroundRoutingPromise();

            expect(result).toEqual(mockConfig);
        });

        it("handles null config", async () => {
            const mockResponse = {
                config: null,
            };

            api.call.mockResolvedValue(mockResponse);

            await expect(getGroundRoutingPromise()).rejects.toThrow(
                "Ground routing config not found"
            );
        });
    });

    describe("setGroundRoutingPromise", () => {
        it("calls the correct ubus endpoint with config data", async () => {
            const config = {
                enabled: true,
                interfaces: ["eth0"],
            };
            const mockResponse = { success: true };

            api.call.mockResolvedValue(mockResponse);

            await setGroundRoutingPromise(config);

            expect(api.call).toHaveBeenCalledWith(
                "lime-groundrouting",
                "set",
                config
            );
        });

        it("returns response from API", async () => {
            const config = { enabled: false };
            const mockResponse = {
                success: true,
                message: "Configuration updated",
                changes_applied: true,
            };

            api.call.mockResolvedValue(mockResponse);

            const result = await setGroundRoutingPromise(config);

            expect(result).toEqual(mockResponse);
        });

        it("handles empty config", async () => {
            const config = {};
            const mockResponse = { success: true };

            api.call.mockResolvedValue(mockResponse);

            await setGroundRoutingPromise(config);

            expect(api.call).toHaveBeenCalledWith(
                "lime-groundrouting",
                "set",
                {}
            );
        });

        it("handles complex config", async () => {
            const config = {
                global: {
                    enabled: true,
                    debug_level: 2,
                },
                interfaces: {
                    eth0: {
                        metric: 100,
                        gateway: "192.168.1.1",
                        dns: ["8.8.8.8", "1.1.1.1"],
                    },
                },
                routes: [
                    {
                        destination: "0.0.0.0/0",
                        gateway: "192.168.1.1",
                        metric: 100,
                    },
                ],
            };
            const mockResponse = { success: true };

            api.call.mockResolvedValue(mockResponse);

            await setGroundRoutingPromise(config);

            expect(api.call).toHaveBeenCalledWith(
                "lime-groundrouting",
                "set",
                config
            );
        });

        it("handles null config", async () => {
            const config = null;
            const mockResponse = { success: true };

            api.call.mockResolvedValue(mockResponse);

            await setGroundRoutingPromise(config);

            expect(api.call).toHaveBeenCalledWith(
                "lime-groundrouting",
                "set",
                null
            );
        });

        it("handles API errors", async () => {
            const config = { enabled: true };
            const error = new Error("Save failed");
            api.call.mockRejectedValue(error);

            await expect(setGroundRoutingPromise(config)).rejects.toThrow(
                "Save failed"
            );
        });

        it("handles validation errors from backend", async () => {
            const config = { invalid_option: true };
            const mockResponse = {
                success: false,
                error: "Invalid configuration option: invalid_option",
            };

            api.call.mockResolvedValue(mockResponse);

            const result = await setGroundRoutingPromise(config);

            expect(result).toEqual(mockResponse);
        });
    });
});
