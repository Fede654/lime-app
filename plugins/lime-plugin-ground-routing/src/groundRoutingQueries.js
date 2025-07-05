import { useMutation, useQuery } from "@tanstack/react-query";

import queryCache from "utils/queryCache";

import {
    getGroundRoutingPromise,
    setGroundRoutingPromise,
} from "./groundRoutingApi";

export function useGroundRouting(queryConfig) {
    return useQuery(
        ["lime-groundrouting", "get"],
        getGroundRoutingPromise,
        queryConfig
    );
}

export function useSetGroundRouting() {
    return useMutation(setGroundRoutingPromise, {
        onSuccess: () => {
            // Invalidate and refetch ground routing data
            queryCache.invalidateQueries(["lime-groundrouting", "get"]);
        },
    });
}
