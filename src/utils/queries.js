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
import queryCache, { createSafeQuery } from "./queryCache";
import api from "./uhttpd.service";

export function useSession() {
    return useQuery(["session", "get"], createSafeQuery(getSession), {
        staleTime: 0, // Don't use stale data
        cacheTime: 0, // Don't cache results
        retry: 1, // Only retry once
        retryDelay: 1000, // Wait 1 second before retry
        refetchOnWindowFocus: false,
        refetchOnMount: true, // Always refetch on mount
        refetchOnReconnect: false,
        onError: (error) => {
            // Handle different types of errors properly
            if (error === undefined || error === null) {
                console.debug(
                    "Session check: Undefined error (likely service issue)"
                );
            } else if (error && error.code === -32002) {
                console.debug(
                    "Session check: Access denied (not authenticated)"
                );
            } else if (error && error.message) {
                console.debug("Session check failed:", error.message);
            } else if (error) {
                console.debug("Session check failed:", error);
            }
        },
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
            // Login response structure: { data: { username: "root" }, ... }
            // Extract username safely with fallback
            const username =
                res?.data?.username ||
                (res?.access_group?.root ? "root" : null);
            if (username) {
                queryCache.setQueryData(["session", "get"], () => ({
                    username,
                }));
            } else {
                console.debug(
                    "Login success but no username found in response:",
                    res
                );
            }
        },
        onError: (error) => {
            // Handle login errors gracefully
            if (error && error.code === -32002) {
                console.debug(
                    "Login failed: Access denied (invalid credentials)"
                );
            } else if (error) {
                console.debug("Login failed:", error.message || error);
            }
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
            // Fix: go to root path with login hash
            const baseUrl = `${window.location.origin}/`;
            window.location.href = `${baseUrl}#/login`;
        },
    });
}

export function useBoardData(config) {
    return useQuery(["system", "board"], createSafeQuery(getBoardData), {
        onError: (error) => {
            // Handle different types of errors properly
            if (error === undefined || error === null) {
                console.debug(
                    "Board data: Undefined error (likely service issue)"
                );
            } else if (error && error.code === -32002) {
                console.debug("Board data: Access denied (not authenticated)");
            } else if (error && error.message) {
                console.debug("Board data failed:", error.message);
            } else if (error) {
                console.debug("Board data failed:", error);
            }
        },
        ...config,
    });
}

export function useCommunitySettings() {
    // @ts-ignore
    return useQuery(
        ["lime-utils", "get_community_settings"],
        createSafeQuery(getCommunitySettings),
        {
            initialData: DEFAULT_COMMUNITY_SETTINGS,
            initialStale: true,
        }
    );
}

export function useBatHost(mac, outgoingIface, queryConfig) {
    return useQuery(
        ["bat-hosts", "get_bathost", mac, outgoingIface],
        createSafeQuery(async () => getBatHost(mac, outgoingIface)),
        {
            retry: 3,
            ...queryConfig,
        }
    );
}

export function useNeedReboot() {
    return useQuery(
        ["changes-need-reboot"],
        createSafeQuery(getChangesNeedReboot)
    );
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
    return useQuery(
        ["check-internet", "is_connected"],
        createSafeQuery(checkInternet)
    );
}
