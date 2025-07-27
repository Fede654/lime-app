/**
 * Lightweight color scale utility
 * Replaces simple-color-scale with custom implementation
 *
 * Target: ~1KB vs 28KB simple-color-scale package
 * Supports: Linear color interpolation, configurable ranges
 */

class ColorScale {
    config: {
        outputStart: number;
        outputEnd: number;
        inputStart: number;
        inputEnd: number;
        colorStart: string;
        colorEnd: string;
    };

    constructor() {
        this.config = {
            outputStart: 0,
            outputEnd: 100,
            inputStart: 0,
            inputEnd: 100,
            colorStart: "#ff0000", // Red
            colorEnd: "#00ff00", // Green
        };
    }

    /**
     * Set configuration for the color scale
     */
    setConfig(
        config: Partial<{
            outputStart: number;
            outputEnd: number;
            inputStart: number;
            inputEnd: number;
            colorStart: string;
            colorEnd: string;
        }>
    ) {
        this.config = { ...this.config, ...config };
    }

    /**
     * Convert hex color to RGB values
     * @param {string} hex - Hex color (#ffffff or #fff)
     * @returns {Array<number>} [r, g, b] values (0-255)
     */
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!result) {
            // Handle 3-digit hex
            const shortResult = /^#?([a-f\d])([a-f\d])([a-f\d])$/i.exec(hex);
            if (shortResult) {
                return [
                    parseInt(shortResult[1] + shortResult[1], 16),
                    parseInt(shortResult[2] + shortResult[2], 16),
                    parseInt(shortResult[3] + shortResult[3], 16),
                ];
            }
            return [0, 0, 0]; // Default to black for invalid hex
        }
        return [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16),
        ];
    }

    /**
     * Convert RGB values to hex color
     * @param {number} r - Red (0-255)
     * @param {number} g - Green (0-255)
     * @param {number} b - Blue (0-255)
     * @returns {string} Hex color string
     */
    rgbToHex(r, g, b) {
        return `#${[r, g, b]
            .map((x) => {
                const hex = Math.round(Math.max(0, Math.min(255, x))).toString(
                    16
                );
                return hex.length === 1 ? `0${hex}` : hex;
            })
            .join("")}`;
    }

    /**
     * Interpolate between two values
     * @param {number} start - Start value
     * @param {number} end - End value
     * @param {number} factor - Interpolation factor (0-1)
     * @returns {number} Interpolated value
     */
    interpolate(start, end, factor) {
        return start + (end - start) * factor;
    }

    /**
     * Get color for a given input value
     * @param {number} value - Input value
     * @returns {string} Hex color string
     */
    getColor(value) {
        const { inputStart, inputEnd, colorStart, colorEnd } = this.config;

        // Normalize input value to 0-1 range
        let factor = (value - inputStart) / (inputEnd - inputStart);
        factor = Math.max(0, Math.min(1, factor)); // Clamp to 0-1

        // Get RGB values for start and end colors
        const startRgb = this.hexToRgb(colorStart);
        const endRgb = this.hexToRgb(colorEnd);

        // Interpolate RGB values
        const r = this.interpolate(startRgb[0], endRgb[0], factor);
        const g = this.interpolate(startRgb[1], endRgb[1], factor);
        const b = this.interpolate(startRgb[2], endRgb[2], factor);

        return this.rgbToHex(r, g, b);
    }

    /**
     * Get color using predefined signal strength colors
     * Provides better colors for signal strength visualization
     * @param {number} value - Signal strength value (typically negative dBm)
     * @returns {string} Hex color string
     */
    getSignalColor(value) {
        // Signal strength color mapping (red to green)
        // Strong signal (closer to 0) = green
        // Weak signal (more negative) = red
        const colors = [
            { threshold: -30, color: "#00ff00" }, // Excellent (green)
            { threshold: -50, color: "#80ff00" }, // Good (yellow-green)
            { threshold: -60, color: "#ffff00" }, // Fair (yellow)
            { threshold: -70, color: "#ff8000" }, // Poor (orange)
            { threshold: -90, color: "#ff0000" }, // Bad (red)
        ];

        // Find appropriate color based on signal strength
        for (let i = 0; i < colors.length - 1; i++) {
            if (value >= colors[i].threshold) {
                // Interpolate between this color and the next
                const current = colors[i];
                const next = colors[i + 1];

                const factor =
                    (value - current.threshold) /
                    (next.threshold - current.threshold);

                const currentRgb = this.hexToRgb(current.color);
                const nextRgb = this.hexToRgb(next.color);

                const r = this.interpolate(currentRgb[0], nextRgb[0], factor);
                const g = this.interpolate(currentRgb[1], nextRgb[1], factor);
                const b = this.interpolate(currentRgb[2], nextRgb[2], factor);

                return this.rgbToHex(r, g, b);
            }
        }

        // Return the last color for very weak signals
        return colors[colors.length - 1].color;
    }
}

// Create singleton instance
const colorScale = new ColorScale();

// Set default configuration for LibreMesh signal strength
colorScale.setConfig({
    outputStart: 1,
    outputEnd: 100,
    inputStart: -30,
    inputEnd: -90,
    colorStart: "#00ff00", // Green for strong signal
    colorEnd: "#ff0000", // Red for weak signal
});

export default colorScale;
export { ColorScale };
