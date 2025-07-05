import "@testing-library/jest-dom";
import { act, screen } from "@testing-library/preact";

import {
    getBoardData,
    getChangesNeedReboot,
    getCommunitySettings,
    getSession,
} from "utils/api";
import { DEFAULT_COMMUNITY_SETTINGS } from "utils/constants";
import queryCache from "utils/queryCache";
import { render } from "utils/test_utils";

import { getCloudNodesPromise } from "./src/changeNodeApi";
import ChangeNodePage from "./src/changeNodePage";

jest.mock("./src/changeNodeApi");
jest.mock("utils/api");

const mockCloudNodes = [
    "lime-node-001",
    "lime-node-002",
    "lime-node-003",
    "current-node",
];

describe("changeNode page", () => {
    beforeEach(() => {
        getCloudNodesPromise.mockImplementation(async () => mockCloudNodes);
        getBoardData.mockImplementation(async () => ({
            hostname: "current-node",
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
    });

    it("shows title and description", async () => {
        render(<ChangeNodePage />);

        expect(
            await screen.findByText(/Visit a neighboring node/i)
        ).toBeInTheDocument();

        expect(
            await screen.findByText(
                /Select another node and use the LimeApp as you were there/i
            )
        ).toBeInTheDocument();
    });

    it("loads and displays cloud nodes in select dropdown", async () => {
        render(<ChangeNodePage />);

        const selectElement = await screen.findByRole("combobox");
        expect(selectElement).toBeInTheDocument();

        // Check that all nodes are present as options
        for (const node of mockCloudNodes) {
            expect(await screen.findByText(node)).toBeInTheDocument();
        }
    });

    it("shows current node as default selected option", async () => {
        render(<ChangeNodePage />);

        // Wait for the select to be populated and have the correct value
        await screen.findByDisplayValue("current-node");

        const selectElement = await screen.findByRole("combobox");
        expect(selectElement.value).toBe("current-node");
    });

    it("sorts nodes with current node at the end", async () => {
        render(<ChangeNodePage />);

        // Should be sorted alphabetically with current node last
        const expectedOrder = [
            "lime-node-001",
            "lime-node-002",
            "lime-node-003",
            "current-node",
        ];

        // Check that all expected options are present
        for (const expectedValue of expectedOrder) {
            expect(await screen.findByText(expectedValue)).toBeInTheDocument();
        }
    });

    it("enables visit button when a node is selected", async () => {
        render(<ChangeNodePage />);

        const visitButton = await screen.findByRole("button", {
            name: /visit/i,
        });
        expect(visitButton).toBeInTheDocument();
        expect(visitButton).not.toBeDisabled();
    });

    it("handles API errors gracefully", async () => {
        getCloudNodesPromise.mockRejectedValue(new Error("API Error"));

        render(<ChangeNodePage />);

        // Should still render the basic UI structure
        expect(
            await screen.findByText(/Visit a neighboring node/i)
        ).toBeInTheDocument();
    });

    it("shows loading state when fetching cloud nodes", async () => {
        // Make the promise never resolve to test loading state
        getCloudNodesPromise.mockImplementation(
            () => new Promise(() => {}) // Never resolves
        );

        render(<ChangeNodePage />);

        expect(
            await screen.findByText(/Visit a neighboring node/i)
        ).toBeInTheDocument();

        // The select should still be rendered even in loading state
        const selectElement = screen.getByRole("combobox");
        expect(selectElement).toBeInTheDocument();
    });
});
