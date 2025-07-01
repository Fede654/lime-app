import { useMutation, useQuery } from "@tanstack/react-query";

import queryCache from "utils/queryCache";

import {
    addVoucher,
    createCompression,
    getPortalConfig,
    getPortalContent,
    invalidate,
    listVouchers,
    rename,
    setPortalConfig,
    setPortalContent,
} from "./piraniaApi";

export const usePortalConfig = () =>
    useQuery({
        queryKey: ["pirania", "get_portal_config"],
        queryFn: getPortalConfig,
    });

export const useSetPortalConfig = () =>
    useMutation({
        mutationFn: setPortalConfig,
        onSuccess: () =>
            queryCache.invalidateQueries(["pirania", "get_portal_config"]),
    });

export const usePortalContent = () =>
    useQuery({
        queryKey: ["pirania", "get_portal_page_content"],
        queryFn: getPortalContent,
    });

export const useSetPortalContent = () =>
    useMutation({
        mutationFn: setPortalContent,
        onSuccess: () =>
            queryCache.invalidateQueries([
                "pirania",
                "get_portal_page_content",
            ]),
    });

export const useLogoCompression = () =>
    useQuery({
        queryKey: ["local-service", "logo_compression"],
    });

export const useCreateCompression = () =>
    useMutation({
        mutationFn: createCompression,
        onSuccess: (compression) =>
            queryCache.setQueryData(
                ["local-service", "logo_compression"],
                compression
            ),
    });

export function useListVouchers() {
    return useQuery({
        queryKey: ["pirania", "list_vouchers"],
        queryFn: listVouchers,
    });
}

export function useAddVoucher() {
    return useMutation({
        mutationFn: addVoucher,
        onSuccess: (data) => {
            queryCache.invalidateQueries(["pirania", "list_vouchers"]);
            return data;
        },
    });
}

export function useRename() {
    return useMutation({
        mutationFn: rename,
        onSuccess: (data) => {
            queryCache.invalidateQueries(["pirania", "list_vouchers"]);
            return data;
        },
    });
}

export function useInvalidate() {
    return useMutation({
        mutationFn: invalidate,
        onSuccess: (data) => {
            queryCache.invalidateQueries(["pirania", "list_vouchers"]);
            return data;
        },
    });
}
