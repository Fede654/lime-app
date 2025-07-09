import api from "utils/uhttpd.service";

export function getSession() {
    return api
        .call("tmate", "get_session", {})
        .then((result) =>
            result.session && result.session.rw_ssh ? result.session : null
        )
        .catch((error) => {
            // Handle "Object not found" error when tmate package is not installed
            if (
                error?.code === -32000 ||
                error?.message?.includes("Object not found")
            ) {
                return null;
            }
            throw error;
        });
}

export function openSession() {
    return api.call("tmate", "open_session", {}).catch((error) => {
        // Handle "Object not found" error when tmate package is not installed
        if (
            error?.code === -32000 ||
            error?.message?.includes("Object not found")
        ) {
            throw new Error(
                "Remote support is not available. The tmate package may not be installed."
            );
        }
        closeSession();
        throw error;
    });
}

export function closeSession() {
    return api.call("tmate", "close_session", {}).catch((error) => {
        // Ignore errors when closing session (tmate might not be installed)
        if (
            error?.code === -32000 ||
            error?.message?.includes("Object not found")
        ) {
            return null;
        }
        throw error;
    });
}
