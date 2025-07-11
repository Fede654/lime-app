const UNAUTH_SESSION_ID = "00000000000000000000000000000000";
const DEFAULT_SESSION_TIMEOUT = 5000;

const parseResult = (result) =>
    new Promise((res, rej) => {
        if (result.error) {
            // Handle common access errors more gracefully
            if (result.error.code === -32002) {
                console.warn("ubus access denied - session may be expired");
            } else if (result.error.code === -32000) {
                console.warn(
                    "ubus object not found - service may not be available"
                );
            }
            // Ensure we always reject with a proper Error object
            const error = result.error || "Unknown ubus RPC error";
            if (error instanceof Error) {
                return rej(error);
            }
            const errorMessage =
                typeof error === "string" ? error : JSON.stringify(error);
            return rej(new Error(errorMessage));
        }
        if (result.result[0] !== 0) {
            // Convert result to proper Error object
            const rawErrorMsg =
                result.result[1] ||
                result.message ||
                `ubus call failed with code: ${result.result[0]}`;
            const errorMsg =
                typeof rawErrorMsg === "string"
                    ? rawErrorMsg
                    : JSON.stringify(rawErrorMsg);
            return rej(new Error(errorMsg));
        }

        // Extract the actual data from the response
        const data = result.result[1];

        // CRITICAL FIX: Handle undefined/missing data properly
        if (data === undefined || data === null) {
            return rej(
                new Error(
                    "ubus response missing data - service may be unavailable"
                )
            );
        }

        if (data && data.status === "error") {
            // Ensure we always reject with a proper Error object, not undefined
            const rawMessage =
                data.message || data.error || "Unknown ubus error occurred";
            const errorMessage =
                typeof rawMessage === "string"
                    ? rawMessage
                    : JSON.stringify(rawMessage);
            return rej(new Error(errorMessage));
        }

        return res(data);
    });

export class UhttpdService {
    constructor(customIp) {
        this.url = customIp
            ? `http://${customIp}/ubus`
            : typeof window !== "undefined"
            ? `${window.origin}/ubus`
            : "/ubus";
        this.customIp =
            customIp ??
            (typeof window !== "undefined" ? window.origin : "localhost");
        this.jsonrpc = "2.0";
        this.sec = 0;
        this.requestList = [];
        this.sidKey = `sid-${customIp}`; // Store sid by url to be able to use multiple instances of uhttpdService
    }

    sid() {
        const sid = sessionStorage.getItem(this.sidKey);
        return sid || UNAUTH_SESSION_ID;
    }

    addId() {
        this.sec += 1;
        return Number(this.sec);
    }

    call(action, method, data, customSid = null, timeout = null) {
        this.sec += 1;
        const body = {
            id: this.addId(),
            jsonrpc: this.jsonrpc,
            method: "call",
            params: [customSid || this.sid(), action, method, data],
        };
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout || 15000);
        return (
            fetch(this.url, {
                method: "POST",
                body: JSON.stringify(body),
                signal: controller.signal,
            })
                .then((response) => {
                    // Check if response is ok and contains valid JSON
                    if (!response.ok) {
                        throw new Error(
                            `HTTP ${response.status} ${response.statusText} - Backend unavailable at ${this.url}`
                        );
                    }

                    const contentType = response.headers.get("content-type");
                    if (
                        !contentType ||
                        !contentType.includes("application/json")
                    ) {
                        throw new Error(
                            `Expected JSON response but got ${
                                contentType || "unknown"
                            } - Backend may be unreachable`
                        );
                    }

                    return response.json();
                })
                .then(parseResult)
                .catch((error) => {
                    if (error.name === "AbortError") {
                        throw new Error(
                            `Request timeout after ${
                                timeout || 15000
                            }ms - Backend may be unreachable`
                        );
                    }
                    if (
                        error.name === "TypeError" &&
                        error.message.includes("fetch")
                    ) {
                        throw new Error(
                            `Network error: Cannot reach backend at ${this.url} - Check if LibreMesh device is accessible`
                        );
                    }
                    if (error.message.includes("JSON")) {
                        throw new Error(
                            `Invalid JSON response from ${this.url} - Backend may be returning error page instead of JSON`
                        );
                    }
                    throw error;
                })
                // @ts-ignore
                .finally(clearTimeout(id))
        );
    }

    login(username, password) {
        const data = { username, password, timeout: DEFAULT_SESSION_TIMEOUT };
        return this.call("session", "login", data, UNAUTH_SESSION_ID).then(
            (response) =>
                new Promise((res, rej) => {
                    if (response.ubus_rpc_session) {
                        sessionStorage.setItem(
                            this.sidKey,
                            response.ubus_rpc_session
                        );
                        res(response);
                    } else {
                        rej(response);
                    }
                })
        );
    }

    logout() {
        return this.call("session", "destroy", {}).then(() => {
            sessionStorage.removeItem(this.sidKey);
            return { success: true };
        });
    }
}

const uhttpdService = new UhttpdService();
export default uhttpdService;
