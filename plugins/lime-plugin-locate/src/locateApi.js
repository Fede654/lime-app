import api from "utils/uhttpd.service";

export const getLocation = () => {
    // In development, return mock location data
    const isDev =
        process.env.NODE_ENV === "development" ||
        (typeof window !== "undefined" &&
            window.location.hostname === "localhost");

    if (isDev) {
        // Return mock location for development (Córdoba coordinates as example)
        return Promise.resolve({
            location: {
                lat: "-31.4201",
                lon: "-64.1888",
            },
            default: false,
        });
    }

    // Production - actual API call
    return api.call("lime-location", "get", {});
};

export const getNodesandlinks = async () => {
    // In development, return mock nodes data
    const isDev =
        process.env.NODE_ENV === "development" ||
        (typeof window !== "undefined" &&
            window.location.hostname === "localhost");

    if (isDev) {
        // Return mock nodes data for development
        return Promise.resolve({
            "test-node": {
                data: {
                    coordinates: {
                        lat: -31.4201,
                        lon: -64.1888,
                    },
                },
            },
        });
    }

    // Production - actual API call
    return api.call("lime-location", "all_nodes_and_links", {});
};

export const changeLocation = async (location) => {
    // In development, simulate successful location change
    const isDev =
        process.env.NODE_ENV === "development" ||
        (typeof window !== "undefined" &&
            window.location.hostname === "localhost");

    if (isDev) {
        // Simulate API response for development
        return Promise.resolve({
            lat: location.lat.toFixed(5),
            lon: location.lon.toFixed(5),
        });
    }

    // Production - actual API call
    return await api.call("lime-location", "set", {
        lat: location.lat.toFixed(5),
        lon: location.lon.toFixed(5),
    });
};
