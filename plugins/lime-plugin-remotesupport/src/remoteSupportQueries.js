import { useMutation, useQuery } from "@tanstack/react-query";

import queryCache from "utils/queryCache";

import { closeSession, getSession, openSession } from "./remoteSupportApi";

export function useSession(queryConfig) {
    return useQuery({
        queryKey: ["tmate", "get_session"],
        queryFn: getSession,
        ...queryConfig,
    });
}

export function useOpenSession() {
    return useMutation({
        mutationFn: openSession,
        onSuccess: () => queryCache.invalidateQueries(["tmate", "get_session"]),
        onError: () => queryCache.setQueryData(["tmate", "get_session"], null),
    });
}

export function useCloseSession() {
    return useMutation({
        mutationFn: closeSession,
        onSuccess: () => queryCache.invalidateQueries(["tmate", "get_session"]),
    });
}
