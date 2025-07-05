import { map } from "rxjs/operators";

import api from "utils/uhttpd.service";

// Legacy RxJS-based API (for backward compatibility during migration)
export const getCloudNodes = (wsAPI) =>
    wsAPI.call("lime-utils", "get_cloud_nodes", {}).pipe(
        map((x) => x.nodes),
        map((data) =>
            Object.keys(data)
                .map((key) => data[key])
                .reduce((x, y) => x.concat(y), [])
        )
    );

// Modern Promise-based API
export const getCloudNodesPromise = () =>
    api
        .call("lime-utils", "get_cloud_nodes", {})
        .then((res) => res.nodes)
        .then((data) =>
            Object.keys(data)
                .map((key) => data[key])
                .reduce((x, y) => x.concat(y), [])
        );
