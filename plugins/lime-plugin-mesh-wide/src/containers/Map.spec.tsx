import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { screen } from "@testing-library/preact";

import { doSharedStateApiCall } from "components/shared-state/SharedStateApi";

import { MeshWideMap } from "plugins/lime-plugin-mesh-wide/src/containers/Map";
import { NodesProvider } from "plugins/lime-plugin-mesh-wide/src/hooks/useNodes";
import { FloatingAlert } from "plugins/lime-plugin-mesh-wide/src/components/Map/FloatingAlert";
import { nodesReferenceState } from "plugins/lime-plugin-mesh-wide/src/meshWideMocks";

import { render } from "utils/test_utils";

jest.mock("leaflet");
jest.mock("components/shared-state/SharedStateApi");
jest.mock("plugins/lime-plugin-mesh-wide/src/meshWideQueries", () => ({
    useMeshWideNodesReference: jest.fn(),
    useMeshWideNodes: jest.fn(),
    useSelectedMapFeature: jest.fn(),
}));
jest.mock("plugins/lime-plugin-locate/src/locateQueries", () => ({
    useLoadLeaflet: jest.fn(),
    useLocation: jest.fn(),
}));
jest.mock("plugins/lime-plugin-mesh-wide/src/hooks/useMeshWideDataErrors", () => ({
    useMeshWideDataErrors: jest.fn(),
}));

import {
    useMeshWideNodesReference,
    useMeshWideNodes,
    useSelectedMapFeature,
} from "plugins/lime-plugin-mesh-wide/src/meshWideQueries";
import { useLoadLeaflet, useLocation } from "plugins/lime-plugin-locate/src/locateQueries";
import { useMeshWideDataErrors } from "plugins/lime-plugin-mesh-wide/src/hooks/useMeshWideDataErrors";

const mockedDoSharedStateApiCall = jest.mocked(doSharedStateApiCall);
const mockedUseMeshWideNodesReference = jest.mocked(useMeshWideNodesReference);
const mockedUseMeshWideNodes = jest.mocked(useMeshWideNodes);
const mockedUseSelectedMapFeature = jest.mocked(useSelectedMapFeature);
const mockedUseLoadLeaflet = jest.mocked(useLoadLeaflet);
const mockedUseLocation = jest.mocked(useLocation);
const mockedUseMeshWideDataErrors = jest.mocked(useMeshWideDataErrors);

describe("Map component", () => {
    beforeEach(() => {
        // Mock the mesh-wide queries
        mockedUseMeshWideNodesReference.mockReturnValue({
            data: nodesReferenceState,
        });
        mockedUseMeshWideNodes.mockReturnValue({
            data: nodesReferenceState,
        });
        mockedUseSelectedMapFeature.mockReturnValue({
            data: null,
            setData: jest.fn(),
        });
        
        // Mock location queries
        mockedUseLoadLeaflet.mockReturnValue({
            isLoading: false,
            data: { leaflet: true },
        });
        mockedUseLocation.mockReturnValue({
            data: { location: { lat: "0", lon: "0" } },
            isLoading: false,
        });
        
        // Mock data errors hook
        mockedUseMeshWideDataErrors.mockReturnValue({
            meshWideDataErrors: [],
            dataNotSetErrors: [],
        });
        
        mockedDoSharedStateApiCall.mockResolvedValue(nodesReferenceState);
    });

    it("should show nodes alert when a node has not configured properly the coordinates", async () => {
        // Create a copy to avoid mutating the original mock data
        const invalidNodesState = { ...nodesReferenceState };
        invalidNodesState["primero"] = {
            ...invalidNodesState["primero"],
            coordinates: {
                long: "FIXME",
                lat: "FIXME",
            },
        };
        
        // Update mocks to return data with invalid coordinates
        mockedUseMeshWideNodesReference.mockReturnValue({
            data: {},  // Empty reference state
        });
        mockedUseMeshWideNodes.mockReturnValue({
            data: invalidNodesState,  // Actual state with invalid coordinates
        });
        
        render(
            <NodesProvider>
                <FloatingAlert />
            </NodesProvider>
        );
        expect(
            await screen.findByTestId("has-invalid-nodes")
        ).toBeInTheDocument();
    });
});
