import { map } from "rxjs/operators";

import api from "utils/uhttpd.service";

// Legacy RxJS-based API (for backward compatibility during migration)
export const getGroundRouting = (wsAPI, sid) =>
    wsAPI.call(sid, "lime-groundrouting", "get", {}).pipe(
        map((x) => {
            if (typeof x.config === "undefined") {
                throw { error: true };
            }
            return x;
        })
    );

export const setGroundRouting = (wsAPI, sid, config) =>
    wsAPI.call(sid, "lime-groundrouting", "set", config);

// Modern Promise-based API
export const getGroundRoutingPromise = () =>
    api.call("lime-groundrouting", "get", {}).then((res) => {
        if (typeof res.config === "undefined" || res.config === null) {
            throw new Error("Ground routing config not found");
        }
        return res.config;
    });

export const setGroundRoutingPromise = (config) =>
    api.call("lime-groundrouting", "set", config);
