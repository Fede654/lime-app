import { useQuery } from "@tanstack/react-query";

import { getInternetStatus, getNodeStatus } from "./rxApi";

const refetchInterval = 2000;

export function useNodeStatus(params) {
    return useQuery({
        queryKey: ["lime-rx", "node-status"],
        queryFn: getNodeStatus,
        enabled: true,
        refetchInterval,
        ...params,
    });
}

export function useInternetStatus(params) {
    return useQuery({
        queryKey: ["lime-rx", "internet-status"],
        queryFn: getInternetStatus,
        placeholderData: {
            IPv4: { working: null },
            IPv6: { working: null },
            DNS: { working: null },
        },
        enabled: true,
        refetchInterval,
        ...params,
    });
}
