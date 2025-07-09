import { isValidCoordinate, readableBytes, readableWifiRate } from "./utils";

describe("readableBytes", () => {
    it("handles zero bytes", () => {
        expect(readableBytes(0)).toBe("0 Byte");
    });

    it("handles bytes", () => {
        expect(readableBytes(512)).toBe("512 B");
    });

    it("handles kilobytes", () => {
        expect(readableBytes(1024)).toBe("1.0 KB");
        expect(readableBytes(1536)).toBe("1.5 KB");
    });

    it("handles megabytes", () => {
        expect(readableBytes(1048576)).toBe("1.0 MB");
    });
});

describe("readableWifiRate", () => {
    it("handles zero rate", () => {
        expect(readableWifiRate(0)).toBe("0 Mbit/s");
    });

    it("converts bytes/s to Kbit/s for small values", () => {
        // 125 bytes/s = 1000 bits/s = 1 Kbit/s
        expect(readableWifiRate(125)).toBe("1 Kbit/s");
    });

    it("converts bytes/s to Mbit/s for medium values", () => {
        // 125000 bytes/s = 1 Mbit/s
        expect(readableWifiRate(125000)).toBe("1.0 Mbit/s");

        // Typical WiFi rate: 7250000 bytes/s = 58 Mbit/s
        expect(readableWifiRate(7250000)).toBe("58.0 Mbit/s");
    });

    it("converts bytes/s to Gbit/s for large values", () => {
        // 125000000 bytes/s = 1 Gbit/s
        expect(readableWifiRate(125000000)).toBe("1.0 Gbit/s");
    });

    it("handles decimal precision correctly", () => {
        // 156250 bytes/s = 1.25 Mbit/s
        expect(readableWifiRate(156250)).toBe("1.3 Mbit/s");
    });
});

describe("isValidCoordinate", () => {
    it("accepts valid coordinates", () => {
        expect(isValidCoordinate(0, 0)).toBe(true);
        expect(isValidCoordinate(40.7128, -74.006)).toBe(true); // New York
        expect(isValidCoordinate(-33.8688, 151.2093)).toBe(true); // Sydney
        expect(isValidCoordinate(90, 180)).toBe(true); // Max values
        expect(isValidCoordinate(-90, -180)).toBe(true); // Min values
    });

    it("accepts valid coordinates as strings", () => {
        expect(isValidCoordinate("0", "0")).toBe(true);
        expect(isValidCoordinate("40.7128", "-74.0060")).toBe(true);
        expect(isValidCoordinate("-33.8688", "151.2093")).toBe(true);
    });

    it("rejects coordinates with NaN values", () => {
        expect(isValidCoordinate(NaN, 0)).toBe(false);
        expect(isValidCoordinate(0, NaN)).toBe(false);
        expect(isValidCoordinate(NaN, NaN)).toBe(false);
        expect(isValidCoordinate("invalid", "0")).toBe(false);
        expect(isValidCoordinate("0", "invalid")).toBe(false);
    });

    it("rejects coordinates outside valid ranges", () => {
        // Latitude out of range
        expect(isValidCoordinate(91, 0)).toBe(false);
        expect(isValidCoordinate(-91, 0)).toBe(false);

        // Longitude out of range
        expect(isValidCoordinate(0, 181)).toBe(false);
        expect(isValidCoordinate(0, -181)).toBe(false);

        // Both out of range
        expect(isValidCoordinate(100, 200)).toBe(false);
        expect(isValidCoordinate(-100, -200)).toBe(false);
    });

    it("rejects undefined or null values", () => {
        expect(isValidCoordinate(undefined, 0)).toBe(false);
        expect(isValidCoordinate(0, undefined)).toBe(false);
        expect(isValidCoordinate(null, 0)).toBe(false);
        expect(isValidCoordinate(0, null)).toBe(false);
    });

    it("rejects empty string values", () => {
        expect(isValidCoordinate("", 0)).toBe(false);
        expect(isValidCoordinate(0, "")).toBe(false);
        expect(isValidCoordinate("", "")).toBe(false);
    });
});
