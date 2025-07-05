import "@testing-library/jest-dom";
import { act, fireEvent, screen, waitFor } from "@testing-library/preact";

import {
    getBoardData,
    getChangesNeedReboot,
    getCommunitySettings,
    getSession,
} from "utils/api";
import { DEFAULT_COMMUNITY_SETTINGS } from "utils/constants";
import queryCache from "utils/queryCache";
import { render } from "utils/test_utils";

import { getGroundRoutingPromise } from "./src/groundRoutingApi";
import GroundRoutingPage from "./src/groundRoutingPage";

jest.mock("./src/groundRoutingApi");
jest.mock("utils/api");

const mockGroundRoutingConfig = {
    enabled: true,
    interfaces: ["eth0", "eth1"],
    routing_table: "main",
    metric: 100,
    advanced_options: {
        use_dhcp: true,
        dns_servers: ["8.8.8.8", "1.1.1.1"],
    },
};

describe("ground routing page", () => {
    beforeEach(() => {
        getGroundRoutingPromise.mockImplementation(
            async () => mockGroundRoutingConfig
        );
        getBoardData.mockImplementation(async () => ({
            hostname: "test-node",
            model: "LibreMesh",
        }));
        getCommunitySettings.mockImplementation(
            async () => DEFAULT_COMMUNITY_SETTINGS
        );
        getChangesNeedReboot.mockImplementation(async () => false);
        getSession.mockImplementation(async () => ({
            username: "root",
        }));
    });

    afterEach(() => {
        act(() => queryCache.clear());
        jest.clearAllMocks();
    });

    it("shows title", async () => {
        render(<GroundRoutingPage />);

        expect(
            await screen.findByText(/Ground Routing configuration/i)
        ).toBeInTheDocument();
    });

    it("loads and displays ground routing configuration", async () => {
        render(<GroundRoutingPage />);

        // Wait for configuration to load and be displayed
        await waitFor(() => {
            expect(screen.getByText(/"enabled": true/)).toBeInTheDocument();
        });

        expect(screen.getByText(/"interfaces"/)).toBeInTheDocument();
        expect(screen.getByText(/"eth0"/)).toBeInTheDocument();
        expect(screen.getByText(/"routing_table": "main"/)).toBeInTheDocument();
    });

    it("shows formatted JSON configuration", async () => {
        render(<GroundRoutingPage />);

        const jsonContent = await screen.findByText(/"enabled": true/);
        expect(jsonContent).toBeInTheDocument();

        // Check that JSON is properly formatted (indented)
        const preElement = screen.getByText(/\{\s*"enabled":\s*true/);
        expect(preElement.textContent).toContain('{\n  "enabled": true');
    });

    it("shows loading message when fetching data", async () => {
        // Mock loading state
        getGroundRoutingPromise.mockImplementation(() => new Promise(() => {})); // Never resolves

        render(<GroundRoutingPage />);

        expect(await screen.findByText(/Loading.../)).toBeInTheDocument();
    });

    it("has reload button", async () => {
        render(<GroundRoutingPage />);

        // Wait for data to load first
        await screen.findByText(/"enabled": true/);

        const reloadButton = await screen.findByRole("button", {
            name: /reload/i,
        });
        expect(reloadButton).toBeInTheDocument();
        expect(reloadButton).not.toBeDisabled();
    });

    it("reloads data when reload button is clicked", async () => {
        render(<GroundRoutingPage />);

        // Wait for initial load
        await waitFor(() => {
            expect(getGroundRoutingPromise).toHaveBeenCalledTimes(1);
        });

        const reloadButton = await screen.findByRole("button", {
            name: /reload/i,
        });
        fireEvent.click(reloadButton);

        // Should trigger another API call
        await waitFor(() => {
            expect(getGroundRoutingPromise).toHaveBeenCalledTimes(2);
        });
    });

    it("disables reload button during loading", async () => {
        // Mock slow loading
        let resolvePromise;
        getGroundRoutingPromise.mockImplementation(
            () =>
                new Promise((resolve) => {
                    resolvePromise = resolve;
                })
        );

        render(<GroundRoutingPage />);

        const reloadButton = await screen.findByRole("button", {
            name: /reload/i,
        });
        expect(reloadButton).toBeDisabled();

        // Resolve the promise
        act(() => {
            resolvePromise(mockGroundRoutingConfig);
        });

        await waitFor(() => {
            expect(reloadButton).not.toBeDisabled();
        });
    });

    it("handles empty configuration", async () => {
        getGroundRoutingPromise.mockImplementation(async () => ({}));

        render(<GroundRoutingPage />);

        await waitFor(() => {
            expect(screen.getByText("{}")).toBeInTheDocument();
        });
    });

    it("handles null configuration", async () => {
        getGroundRoutingPromise.mockImplementation(async () => null);

        render(<GroundRoutingPage />);

        await waitFor(() => {
            expect(screen.getByText("null")).toBeInTheDocument();
        });
    });

    it("handles API errors gracefully", async () => {
        getGroundRoutingPromise.mockRejectedValue(new Error("API Error"));

        render(<GroundRoutingPage />);

        // Should still render the basic UI structure
        expect(
            await screen.findByText(/Ground Routing configuration/i)
        ).toBeInTheDocument();

        const reloadButton = await screen.findByRole("button", {
            name: /reload/i,
        });
        expect(reloadButton).toBeInTheDocument();
    });

    it("handles complex nested configuration", async () => {
        const complexConfig = {
            global: {
                enabled: true,
                debug: false,
            },
            interfaces: {
                ethernet: {
                    eth0: { metric: 100, gateway: "192.168.1.1" },
                    eth1: { metric: 200, gateway: "192.168.2.1" },
                },
                wireless: {
                    wlan0: { metric: 300 },
                },
            },
            routes: [
                {
                    destination: "0.0.0.0/0",
                    gateway: "192.168.1.1",
                    metric: 100,
                },
                {
                    destination: "10.0.0.0/8",
                    gateway: "192.168.2.1",
                    metric: 200,
                },
            ],
        };

        getGroundRoutingPromise.mockImplementation(async () => complexConfig);

        render(<GroundRoutingPage />);

        await waitFor(() => {
            expect(screen.getByText(/"enabled": true/)).toBeInTheDocument();
        });

        expect(screen.getByText(/"ethernet"/)).toBeInTheDocument();
        expect(screen.getByText(/"192.168.1.1"/)).toBeInTheDocument();
        expect(screen.getByText(/"routes"/)).toBeInTheDocument();
    });

    it("applies correct styling to pre element", async () => {
        render(<GroundRoutingPage />);

        // Wait for data to load first
        await screen.findByText(/"enabled": true/);

        // Find the pre element using querySelector since it's a specific HTML element
        const preElement = document.querySelector("pre");
        expect(preElement).toBeInTheDocument();

        // Check that the pre element has the expected inline styles
        expect(preElement).toHaveStyle({
            backgroundColor: "#f5f5f5",
            borderRadius: "4px",
            padding: "15px",
            border: "1px solid #ccc",
        });
    });

    it("updates display when configuration changes externally", async () => {
        render(<GroundRoutingPage />);

        await waitFor(() => {
            expect(screen.getByText(/"enabled": true/)).toBeInTheDocument();
        });

        // Simulate external configuration update
        const newConfig = { enabled: false, interfaces: [] };
        getGroundRoutingPromise.mockImplementation(async () => newConfig);

        // Trigger a refetch by invalidating the cache
        act(() => {
            queryCache.invalidateQueries(["lime-groundrouting", "get"]);
        });

        await waitFor(() => {
            expect(screen.getByText(/"enabled": false/)).toBeInTheDocument();
        });
    });
});
