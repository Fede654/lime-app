import { useQuery } from "@tanstack/react-query";

import { getCloudNodesPromise } from "./changeNodeApi";

export function useCloudNodes(queryConfig) {
    return useQuery(
        ["lime-utils", "get_cloud_nodes"],
        getCloudNodesPromise,
        queryConfig
    );
}
