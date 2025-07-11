import api from "utils/uhttpd.service";

export const getMetrics = (ip) => {
    return api.call("lime-metrics", "get_metrics", { target: ip });
};

export const getGateway = () =>
    api.call("lime-metrics", "get_gateway", {}).then((res) => {
        if (!res || res.gateway === undefined) {
            throw new Error("Gateway data not available");
        }
        return res.gateway;
    });

export const getPath = async () =>
    api.call("lime-metrics", "get_path", {}).then((res) => {
        if (!res || res.path === undefined) {
            throw new Error("Path data not available");
        }
        return res.path;
    });

export const getLoss = async (ip) =>
    api.call("lime-metrics", "get_loss", { target: ip }).then((res) => {
        if (!res || res.loss === undefined) {
            throw new Error("Loss data not available");
        }
        return +res.loss;
    });
