import { useMutation, useQuery } from "@tanstack/react-query";

import {
    checkInternet,
    getBatHost,
    getBoardData,
    getChangesNeedReboot,
    getCommunitySettings,
    getSession,
    reboot,
    setChangesNeedReboot,
} from "./api";
import { DEFAULT_COMMUNITY_SETTINGS } from "./constants";
import queryCache from "./queryCache";
import api from "./uhttpd.service";

export function useSession() {
    return useQuery({
        queryKey: ["session", "get"],
        queryFn: getSession,
        staleTime: Infinity,
    });
}

function login({ username, password }) {
    return api.login(username, password);
}

export function useLogin() {
    return useMutation({
        mutationFn: login,
        onSuccess: (res) => {
            queryCache.setQueryData(["session", "get"], () => res.data);
        },
    });
}

export function useBoardData(config) {
    return useQuery({
        queryKey: ["system", "board"],
        queryFn: getBoardData,
        ...config,
    });
}

export function useCommunitySettings() {
    // @ts-ignore
    return useQuery({
        queryKey: ["lime-utils", "get_community_settings"],
        queryFn: getCommunitySettings,
        initialData: DEFAULT_COMMUNITY_SETTINGS,
        initialStale: true,
    });
}

export function useBatHost(mac, outgoingIface, queryConfig) {
    return useQuery({
        queryKey: ["bat-hosts", "get_bathost", mac, outgoingIface],
        queryFn: async () => getBatHost(mac, outgoingIface),
        retry: 3,
        ...queryConfig,
    });
}

export function useNeedReboot() {
    return useQuery({
        queryKey: ["changes-need-reboot"],
        queryFn: getChangesNeedReboot,
    });
}

export function useSetNeedReboot() {
    return useMutation({
        mutationFn: setChangesNeedReboot,
        onSuccess: () => {
            queryCache.invalidateQueries({ queryKey: ["changes-need-reboot"] });
        },
    });
}

export function useReboot() {
    return useMutation({
        mutationFn: reboot,
        onSuccess: () => {
            setChangesNeedReboot("no");
            queryCache.invalidateQueries({ queryKey: ["changes-need-reboot"] });
        },
    });
}

export function useCheckInternet() {
    return useQuery({
        queryKey: ["check-internet", "is_connected"],
        queryFn: checkInternet,
    });
}
