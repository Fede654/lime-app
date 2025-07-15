const UNAUTH_SESSION_ID = "00000000000000000000000000000000";
const DEFAULT_SESSION_TIMEOUT = 5000;

const parseResult = (result) =>
    new Promise((res, rej) => {
        if (!result) {
            return rej(new Error("Empty response from server"));
        }
        if (result.error) {
            // Ensure error is properly formatted
            const errorMessage =
                typeof result.error === "object"
                    ? JSON.stringify(result.error)
                    : String(result.error);
            return rej(new Error(errorMessage));
        }
        if (!result.result || !Array.isArray(result.result)) {
            return rej(new Error("Invalid response format"));
        }
        if (result.result[0] !== 0) {
            const errorInfo = result.result[1];
            let errorMessage = "Unknown error";

            if (typeof errorInfo === "string") {
                errorMessage = errorInfo;
            } else if (errorInfo && typeof errorInfo === "object") {
                // Try to extract meaningful error info from object
                errorMessage =
                    errorInfo.message ||
                    errorInfo.error ||
                    errorInfo.msg ||
                    errorInfo.reason ||
                    (errorInfo.code
                        ? `Error code: ${errorInfo.code}`
                        : JSON.stringify(errorInfo));
            } else if (errorInfo === null || errorInfo === undefined) {
                // Provide more context when errorInfo is null/undefined
                const code = result.result[0];
                if (code === 6) {
                    errorMessage =
                        "Permission denied - invalid username/password or insufficient privileges";
                } else {
                    errorMessage = `Server error (code: ${code}) - no additional error details provided`;
                }
            } else {
                // Last resort - show the raw errorInfo
                errorMessage = `Server error (code: ${
                    result.result[0]
                }) - raw error: ${String(errorInfo)}`;
            }

            return rej(new Error(errorMessage));
        }
        result = result.result[1];
        if (result && result.status === "error") {
            // Try to extract meaningful error information with proper object handling
            let errorDetails = "Unknown error";

            if (typeof result.message === "string") {
                errorDetails = result.message;
            } else if (typeof result.error === "string") {
                errorDetails = result.error;
            } else if (typeof result.data === "string") {
                errorDetails = result.data;
            } else if (typeof result === "string") {
                errorDetails = result;
            } else if (result.message && typeof result.message === "object") {
                try {
                    errorDetails = JSON.stringify(result.message);
                } catch (e) {
                    errorDetails = "Complex error message object";
                }
            } else if (result.error && typeof result.error === "object") {
                try {
                    errorDetails = JSON.stringify(result.error);
                } catch (e) {
                    errorDetails = "Complex error object";
                }
            } else if (result.data && typeof result.data === "object") {
                try {
                    errorDetails = JSON.stringify(result.data);
                } catch (e) {
                    errorDetails = "Complex data object";
                }
            }

            return rej(new Error(errorDetails));
        }
        return res(result);
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
        // Extract hostname from customIp or window.origin for session key
        const hostname =
            customIp ||
            (typeof window !== "undefined"
                ? window.location.hostname
                : "localhost");
        this.sidKey = `sid-${hostname}`; // Store sid by url to be able to use multiple instances of uhttpdService
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
                    if (!response.ok) {
                        throw new Error(
                            `HTTP error! status: ${response.status} for ${action}.${method}`
                        );
                    }
                    return response.json();
                })
                .then(parseResult)
                .catch((error) => {
                    // Add context about which API call failed
                    const apiContext = `[${action}.${method}]`;

                    // Handle various error types gracefully
                    if (error.name === "AbortError") {
                        throw new Error(`${apiContext} Request timeout`);
                    }
                    if (error instanceof SyntaxError) {
                        throw new Error(
                            `${apiContext} Invalid JSON response from server`
                        );
                    }
                    if (error instanceof TypeError) {
                        throw new Error(
                            `${apiContext} Network error or server unreachable`
                        );
                    }

                    // If error already has context, don't add it again
                    if (error.message && error.message.includes(apiContext)) {
                        throw error;
                    }

                    // Add context to other errors with better object handling
                    let errorMessage = "Request failed";

                    if (typeof error === "string") {
                        errorMessage = error;
                    } else if (
                        error.message &&
                        typeof error.message === "string"
                    ) {
                        errorMessage = error.message;
                    } else if (
                        error.message &&
                        typeof error.message === "object"
                    ) {
                        // Handle case where error.message is an object
                        try {
                            errorMessage = JSON.stringify(error.message);
                        } catch (e) {
                            errorMessage = "Complex error object";
                        }
                    } else if (
                        typeof error === "object" &&
                        error.toString &&
                        error.toString() !== "[object Object]"
                    ) {
                        errorMessage = error.toString();
                    }

                    throw new Error(`${apiContext} ${errorMessage}`);
                })
                // @ts-ignore
                .finally(() => clearTimeout(id))
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
