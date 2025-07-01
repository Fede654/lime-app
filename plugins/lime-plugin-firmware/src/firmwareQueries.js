import { useMutation, useQuery } from "@tanstack/react-query";

import queryCache from "utils/queryCache";

import {
    downloadRelease,
    getDownloadStatus,
    getNewVersion,
    getUpgradeInfo,
    upgradeConfirm,
    upgradeFirmware,
    upgradeRevert,
} from "./firmwareApi";

export function useUpgradeInfo(params) {
    return useQuery({
        queryKey: ["lime-utils", "get_upgrade_info"],
        queryFn: getUpgradeInfo,
        ...params,
    });
}

function resetSuCounter() {
    queryCache.setQueryData(["lime-utils", "get_upgrade_info"], (oldInfo) => ({
        ...oldInfo,
        suCounter: -1,
    }));
}

export function useUpgradeConfirm() {
    return useMutation({
        mutationFn: upgradeConfirm,
        onSuccess: resetSuCounter,
    });
}

export function useUpgradeRevert() {
    return useMutation({
        mutationFn: upgradeRevert,
        onSuccess: resetSuCounter,
    });
}

export function useNewVersion(params) {
    return useQuery({
        queryKey: ["eupgrade", "is_new_version_available"],
        queryFn: getNewVersion,
        ...params,
    });
}

export function useDownloadStatus(params) {
    return useQuery({
        queryKey: ["eupgrade", "download_status"],
        queryFn: getDownloadStatus,
        ...params,
    });
}

export function useDownloadRelease() {
    return useMutation({
        mutationFn: downloadRelease,
        onSuccess: () =>
            queryCache.setQueryData(["eupgrade", "download_status"], {
                download_status: "downloading",
            }),
    });
}

export function useUpgradeFirwmare() {
    return useMutation({ mutationFn: upgradeFirmware });
}
