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
    use_dhcp: true,
    gateway: "192.168.1.1",
    dns_servers: ["8.8.8.8", "1.1.1.1"],
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

    it("shows main title and subtitle", async () => {
        render(<GroundRoutingPage />);

        expect(await screen.findByText("Ground Routing")).toBeInTheDocument();
        expect(
            screen.getByText("Internet connectivity and routing configuration")
        ).toBeInTheDocument();
    });

    it("displays overview section with configuration data", async () => {
        render(<GroundRoutingPage />);

        // Wait for Overview section to appear
        await waitFor(() => {
            expect(screen.getByText("Overview")).toBeInTheDocument();
        });

        // Check that status shows as enabled (look for Status label first)
        expect(screen.getByText("Status")).toBeInTheDocument();
        const enabledElements = screen.getAllByText("Enabled");
        expect(enabledElements.length).toBeGreaterThan(0);

        // Check that routing table is displayed
        expect(screen.getByText("main")).toBeInTheDocument();
    });

    it("has functional refresh button", async () => {
        render(<GroundRoutingPage />);

        // Wait for data to load first
        await screen.findByText("Overview");

        const refreshButton = screen.getByText("Refresh");
        expect(refreshButton).toBeInTheDocument();

        // Click the refresh button
        fireEvent.click(refreshButton);

        // Should trigger another API call
        await waitFor(() => {
            expect(getGroundRoutingPromise).toHaveBeenCalledTimes(2);
        });
    });

    it("shows loading state initially", async () => {
        // Mock loading state
        getGroundRoutingPromise.mockImplementation(() => new Promise(() => {})); // Never resolves

        render(<GroundRoutingPage />);

        expect(
            await screen.findByText("Loading ground routing configuration...")
        ).toBeInTheDocument();
    });

    it("shows error state when API fails", async () => {
        getGroundRoutingPromise.mockRejectedValue(new Error("API Error"));

        render(<GroundRoutingPage />);

        // Should show error message
        expect(
            await screen.findByText("Configuration Not Available")
        ).toBeInTheDocument();

        const tryAgainButton = screen.getByText("Try Again");
        expect(tryAgainButton).toBeInTheDocument();
    });

    it("shows error state when configuration is null", async () => {
        getGroundRoutingPromise.mockImplementation(async () => null);

        render(<GroundRoutingPage />);

        await waitFor(() => {
            expect(
                screen.getByText("Configuration Not Available")
            ).toBeInTheDocument();
        });
    });

    it("can expand and view advanced configuration", async () => {
        render(<GroundRoutingPage />);

        // Wait for data to load
        await screen.findByText("Overview");

        // Click on Advanced Configuration to expand it
        const advancedButton = screen.getByText("Advanced Configuration");
        fireEvent.click(advancedButton);

        // Now check for JSON content
        const jsonContent = await screen.findByText(/"enabled": true/);
        expect(jsonContent).toBeInTheDocument();
    });

    it("handles configuration with missing optional fields", async () => {
        const minimalConfig = {
            enabled: false,
        };

        getGroundRoutingPromise.mockImplementation(async () => minimalConfig);

        render(<GroundRoutingPage />);

        await waitFor(() => {
            expect(screen.getByText("Overview")).toBeInTheDocument();
        });

        // Should show disabled status (there may be multiple instances)
        const disabledElements = screen.getAllByText("Disabled");
        expect(disabledElements.length).toBeGreaterThan(0);

        // Should handle missing values gracefully by showing defaults
        expect(screen.getByText("main")).toBeInTheDocument(); // default routing table
        expect(screen.getByText("100")).toBeInTheDocument(); // default metric
        expect(screen.getByText("None")).toBeInTheDocument(); // default interfaces
    });

    it("displays different sections", async () => {
        render(<GroundRoutingPage />);

        await waitFor(() => {
            expect(screen.getByText("Overview")).toBeInTheDocument();
        });

        // Check all section headers are present
        expect(screen.getByText("Network Configuration")).toBeInTheDocument();
        expect(screen.getByText("Custom Routes")).toBeInTheDocument();
        expect(screen.getByText("Advanced Configuration")).toBeInTheDocument();
    });
});
