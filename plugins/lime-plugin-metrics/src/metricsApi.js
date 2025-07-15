import api from "utils/uhttpd.service";

export const getMetrics = (ip) => {
    return api.call("lime-metrics", "get_metrics", { target: ip });
};

export const getGateway = () =>
    api.call("lime-metrics", "get_gateway", {}).then((res) => {
        if (!res || typeof res !== "object") {
            throw new Error("Invalid gateway response format");
        }
        if (!res.gateway) {
            throw new Error("Gateway information not available");
        }
        return res.gateway;
    });

export const getPath = async () =>
    api.call("lime-metrics", "get_path", {}).then((res) => {
        if (!res || typeof res !== "object") {
            throw new Error("Invalid path response format");
        }
        if (!res.path) {
            throw new Error("Path information not available");
        }
        return res.path;
    });

export const getLoss = async (ip) =>
    api.call("lime-metrics", "get_loss", { target: ip }).then((res) => {
        if (!res || typeof res !== "object") {
            throw new Error("Invalid loss response format");
        }
        if (res.loss === undefined || res.loss === null) {
            throw new Error("Loss information not available");
        }
        return +res.loss;
    });
