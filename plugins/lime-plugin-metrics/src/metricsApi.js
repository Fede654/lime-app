import api from "utils/uhttpd.service";

export const getMetrics = (ip) => {
    return api.call("lime-metrics", "get_metrics", { target: ip });
};

export const getGateway = () =>
    api
        .call("lime-metrics", "get_gateway", {})
        .then((res) => {
            if (!res || typeof res !== "object") {
                throw new Error("Invalid gateway response format");
            }
            // Return null if no gateway is available (valid state)
            if (!res.gateway) {
                return null;
            }
            return res.gateway;
        })
        .catch((error) => {
            // Handle older firmware that might not have get_gateway method
            // or nodes that legitimately have no gateway
            const errorMessage = error?.message || error?.toString() || "";

            // If it's a "Not found" or "No gateway available" error, return null
            // This is a valid state, not an error condition
            if (
                errorMessage.includes("Not found") ||
                errorMessage.includes("No gateway available") ||
                errorMessage.includes('code":"1"')
            ) {
                return null;
            }

            // Re-throw other errors
            throw error;
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
