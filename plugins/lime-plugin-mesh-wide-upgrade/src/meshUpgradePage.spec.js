import "@testing-library/jest-dom";
import { act, screen } from "@testing-library/preact";

import queryCache from "utils/queryCache";
import { render } from "utils/test_utils";

import MeshUpgradePage from "./meshUpgradePage";

// Mock the mesh upgrade queries
jest.mock("./meshUpgradeQueries", () => ({
    useMeshWideUpgradeInfo: jest.fn(),
    useMeshUpgradeNodeStatus: jest.fn(),
    useNewVersion: jest.fn(),
    useBecomeMainNode: jest.fn(() => ({ mutate: jest.fn() })),
    useStartFirmwareUpgradeTransaction: jest.fn(() => ({ mutate: jest.fn() })),
    useParallelAbort: jest.fn(() => ({ mutate: jest.fn() })),
    useParallelScheduleUpgrade: jest.fn(() => ({ mutate: jest.fn() })),
    useParallelConfirmUpgrade: jest.fn(() => ({ mutate: jest.fn() })),
}));

// Mock the firmware queries
jest.mock("../../lime-plugin-firmware/src/firmwareQueries", () => ({
    useNewVersion: jest.fn(),
    useUpgradeInfo: jest.fn(),
}));

describe("Mesh wide upgrade Page", () => {
    beforeEach(() => {
        // Reset all mocks and clear query cache
        jest.clearAllMocks();
        act(() => queryCache.clear());
    });

    afterEach(() => {
        act(() => queryCache.clear());
    });

    it("should show loader when upgrade status is loading", async () => {
        const { useMeshWideUpgradeInfo, useMeshUpgradeNodeStatus } =
            jest.requireActual("./meshUpgradeQueries.tsx");
        const { useNewVersion, useUpgradeInfo } = jest.requireActual(
            "../../lime-plugin-firmware/src/firmwareQueries"
        );

        // Mock loading state
        useMeshWideUpgradeInfo.mockReturnValue({
            data: undefined,
            isLoading: true,
            isError: false,
        });

        useMeshUpgradeNodeStatus.mockReturnValue({
            data: undefined,
            isLoading: true,
            isError: false,
        });

        useNewVersion.mockReturnValue({
            data: undefined,
            isLoading: false,
        });

        useUpgradeInfo.mockReturnValue({
            data: undefined,
            isLoading: false,
        });

        render(<MeshUpgradePage />);

        // Should show loading indicator
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it("should show no updates available component when no upgrade is available", async () => {
        const { useMeshWideUpgradeInfo, useMeshUpgradeNodeStatus } =
            jest.requireActual("./meshUpgradeQueries.tsx");
        const { useNewVersion, useUpgradeInfo } = jest.requireActual(
            "../../lime-plugin-firmware/src/firmwareQueries"
        );

        // Mock no update available state
        useMeshWideUpgradeInfo.mockReturnValue({
            data: {},
            isLoading: false,
            isError: false,
        });

        useMeshUpgradeNodeStatus.mockReturnValue({
            data: {
                upgrade_state: "DEFAULT",
                main_node: "MAIN_NODE",
                error: "",
                board_name: "test-board",
                current_fw: "1.0.0",
                node_ip: "10.13.0.1",
            },
            isLoading: false,
            isError: false,
        });

        useNewVersion.mockReturnValue({
            data: null, // No new version available
            isLoading: false,
        });

        useUpgradeInfo.mockReturnValue({
            data: undefined,
            isLoading: false,
        });

        render(<MeshUpgradePage />);

        // Should show no updates message
        expect(screen.getByText(/no.*update/i)).toBeInTheDocument();
    });

    it("should show ready to start transaction when new firmware is downloaded", async () => {
        const { useMeshWideUpgradeInfo, useMeshUpgradeNodeStatus } =
            jest.requireActual("./meshUpgradeQueries.tsx");
        const { useNewVersion, useUpgradeInfo } = jest.requireActual(
            "../../lime-plugin-firmware/src/firmwareQueries"
        );

        // Mock firmware downloaded state
        useMeshWideUpgradeInfo.mockReturnValue({
            data: {},
            isLoading: false,
            isError: false,
        });

        useMeshUpgradeNodeStatus.mockReturnValue({
            data: {
                upgrade_state: "READY_FOR_UPGRADE",
                main_node: "MAIN_NODE",
                error: "",
                board_name: "test-board",
                current_fw: "1.0.0",
                node_ip: "10.13.0.1",
            },
            isLoading: false,
            isError: false,
        });

        useNewVersion.mockReturnValue({
            data: {
                version: "2.0.0",
                release_date: "2024-01-01",
            },
            isLoading: false,
        });

        useUpgradeInfo.mockReturnValue({
            data: undefined,
            isLoading: false,
        });

        render(<MeshUpgradePage />);

        // Should show ready to start transaction message
        expect(screen.getByText(/ready.*start/i)).toBeInTheDocument();
    });

    it("should show node error when an error is returned", async () => {
        const { useMeshWideUpgradeInfo, useMeshUpgradeNodeStatus } =
            jest.requireActual("./meshUpgradeQueries.tsx");
        const { useNewVersion, useUpgradeInfo } = jest.requireActual(
            "../../lime-plugin-firmware/src/firmwareQueries"
        );

        const errorMessage = "Test error occurred";

        // Mock error state
        useMeshWideUpgradeInfo.mockReturnValue({
            data: undefined,
            isLoading: false,
            isError: true,
            error: new Error(errorMessage),
        });

        useMeshUpgradeNodeStatus.mockReturnValue({
            data: {
                upgrade_state: "ERROR",
                main_node: "MAIN_NODE",
                error: errorMessage,
                board_name: "test-board",
                current_fw: "1.0.0",
                node_ip: "10.13.0.1",
            },
            isLoading: false,
            isError: false,
        });

        useNewVersion.mockReturnValue({
            data: null,
            isLoading: false,
        });

        useUpgradeInfo.mockReturnValue({
            data: undefined,
            isLoading: false,
        });

        render(<MeshUpgradePage />);

        // Should show error message
        expect(
            screen.getByText(new RegExp(errorMessage, "i"))
        ).toBeInTheDocument();
    });
});
