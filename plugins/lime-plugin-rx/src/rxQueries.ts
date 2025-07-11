import { useQuery } from "@tanstack/react-query";

import { createSafeQuery } from "utils/queryCache";

import { getInternetStatus, getNodeStatus } from "./rxApi";

const refetchInterval = 2000;

export function useNodeStatus(params?) {
    return useQuery(
        ["lime-rx", "node-status"],
        createSafeQuery(getNodeStatus),
        {
            enabled: true,
            refetchInterval,
            ...params,
        }
    );
}

export function useInternetStatus(params?) {
    return useQuery(
        ["lime-rx", "internet-status"],
        createSafeQuery(getInternetStatus),
        {
            placeholderData: {
                IPv4: { working: null },
                IPv6: { working: null },
                DNS: { working: null },
            },
            enabled: true,
            refetchInterval,
            ...params,
        }
    );
}
