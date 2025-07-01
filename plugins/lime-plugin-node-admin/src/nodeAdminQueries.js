import { useMutation, useQuery } from "@tanstack/react-query";

import { setChangesNeedReboot } from "utils/api";
import queryCache from "utils/queryCache";

import {
    changeApNamePassword,
    changeHostname,
    getAPsData,
    getAdminApsData,
    setupRoamingAP,
} from "./nodeAdminApi";

export const useChangeHostname = () =>
    useMutation({
        mutationFn: changeHostname,
        onSuccess: () => {
            setChangesNeedReboot("yes");
            queryCache.invalidateQueries({ queryKey: ["changes-need-reboot"] });
        },
    });

export const useWifiData = () =>
    useQuery({
        queryKey: ["lime-utils", "get_wifi_data"],
        queryFn: getAPsData,
    });

export const useAdminWifiData = () =>
    useQuery({
        queryKey: ["lime-utils-admin", "get_wifi_data"],
        queryFn: getAdminApsData,
    });

export const useChangeAPPassword = () =>
    useMutation({
        mutationFn: changeApNamePassword,
        onSuccess: () => {
            setChangesNeedReboot("yes");
            queryCache.invalidateQueries({ queryKey: ["changes-need-reboot"] });
            queryCache.invalidateQueries(["lime-utils", "get_wifi_data"]);
            queryCache.invalidateQueries(["lime-utils-admin", "get_wifi_data"]);
        },
    });

export const useSetupRoamingAP = () =>
    useMutation({
        mutationFn: setupRoamingAP,
        onSuccess: () => {
            setChangesNeedReboot("yes");
            queryCache.invalidateQueries({ queryKey: ["changes-need-reboot"] });
            queryCache.invalidateQueries(["lime-utils", "get_wifi_data"]);
            queryCache.invalidateQueries(["lime-utils-admin", "get_wifi_data"]);
        },
    });
