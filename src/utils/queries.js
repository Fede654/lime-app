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
    return useQuery(["session", "get"], getSession, {
        staleTime: 0, // Don't use stale data
        cacheTime: 0, // Don't cache results
        retry: 1, // Only retry once
        retryDelay: 1000, // Wait 1 second before retry
        refetchOnWindowFocus: false,
        refetchOnMount: true, // Always refetch on mount
        refetchOnReconnect: false,
    });
}

/**
 * Login function
 * @param username the username
 * @param password the password
 * @param customApi it accepts a custom instance of UhttpdService to be used for login to a custom API
 */
export function login({ username, password, customApi = null }) {
    if (customApi) {
        return customApi.login(username, password);
    }
    return api.login(username, password);
}

export function useLogin() {
    return useMutation(login, {
        onSuccess: (res) => {
            // Extract username from login response and set session data
            let username = null;

            // Cast to any to avoid TypeScript errors on dynamic response structure
            const response = res;

            if (response && typeof response === "object") {
                // Check if response has access-group (matching getSession API structure)
                if (response["access-group"]) {
                    if (response["access-group"]["root"]) {
                        username = "root";
                    } else if (response["access-group"]["lime-app"]) {
                        username = "lime-app";
                    }
                }
                // Legacy fallback for other response structures
                else if (response["data"] && response["data"]["username"]) {
                    username = response["data"]["username"];
                } else if (
                    response["acls"] &&
                    response["acls"]["access-group"]
                ) {
                    // Check access groups to determine username
                    if (response["acls"]["access-group"]["root"]) {
                        username = "root";
                    } else if (response["acls"]["access-group"]["lime-app"]) {
                        username = "lime-app";
                    }
                }
            }

            // Set session data in query cache
            queryCache.setQueryData(["session", "get"], () => ({ username }));
        },
    });
}

/**
 * Logout function - performs client-side logout
 */
export function logout() {
    // Perform client-side logout directly
    // Clear ALL session storage (not just sid- keys)
    sessionStorage.clear();

    // Try server logout but don't fail if it doesn't work
    api.logout().catch((error) => {
        console.log("Server logout failed (this is often normal):", error);
    });

    return Promise.resolve({ success: true });
}

export function useLogout() {
    return useMutation(logout, {
        onSuccess: () => {
            // Clear session cache to trigger auto-login
            queryCache.removeQueries(["session", "get"]);
            // Clear all queries to prevent access denied errors
            queryCache.clear();
            // Force a full page refresh to reset auto-login state and trigger fresh auto-login
            window.location.reload();
        },
    });
}

export function useBoardData(config) {
    return useQuery(["system", "board"], getBoardData, config);
}

export function useCommunitySettings() {
    // @ts-ignore
    return useQuery(
        ["lime-utils", "get_community_settings"],
        getCommunitySettings,
        {
            initialData: DEFAULT_COMMUNITY_SETTINGS,
            initialStale: true,
        }
    );
}

export function useBatHost(mac, outgoingIface, queryConfig) {
    return useQuery(
        ["bat-hosts", "get_bathost", mac, outgoingIface],
        async () => getBatHost(mac, outgoingIface),
        {
            retry: 3,
            ...queryConfig,
        }
    );
}

export function useNeedReboot() {
    return useQuery(["changes-need-reboot"], getChangesNeedReboot);
}

export function useSetNeedReboot() {
    return useMutation(setChangesNeedReboot, {
        onSuccess: () => {
            queryCache.invalidateQueries({ queryKey: ["changes-need-reboot"] });
        },
    });
}

export function useReboot() {
    return useMutation(reboot, {
        onSuccess: () => {
            setChangesNeedReboot("no");
            queryCache.invalidateQueries({ queryKey: ["changes-need-reboot"] });
        },
    });
}

export function useCheckInternet() {
    return useQuery(["check-internet", "is_connected"], checkInternet);
}
