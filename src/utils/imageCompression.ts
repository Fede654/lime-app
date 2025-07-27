/**
 * Lightweight image compression utility
 * Replaces compressorjs with native Canvas API implementation
 *
 * Target: ~2KB vs 180KB compressorjs package
 * Supports: JPEG/PNG compression, resizing, quality control
 */

/**
 * Compress and resize an image file using Canvas API
 * @param {File} file - Image file to compress
 * @param {Object} options - Compression options
 * @param {number} options.quality - JPEG quality (0.0 to 1.0)
 * @param {number} options.maxWidth - Maximum width in pixels
 * @param {number} options.maxHeight - Maximum height in pixels
 * @param {string} options.mimeType - Output mime type (default: original or image/jpeg)
 * @returns {Promise<string>} Data URL of compressed image
 */
export const compressImage = (file, options) => {
    const {
        quality = 0.6,
        maxWidth = 150,
        maxHeight = 150,
        mimeType = file.type === "image/png" ? "image/png" : "image/jpeg",
    } = options || {};

    return new Promise((resolve, reject) => {
        // Validate input
        if (!file || !file.type?.startsWith("image/")) {
            reject(new Error("Invalid image file"));
            return;
        }

        const img = new Image();
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        img.onload = () => {
            try {
                // Calculate new dimensions maintaining aspect ratio
                let { width, height } = img;

                if (width > maxWidth || height > maxHeight) {
                    const ratio = Math.min(
                        maxWidth / width,
                        maxHeight / height
                    );
                    width = Math.floor(width * ratio);
                    height = Math.floor(height * ratio);
                }

                // Set canvas dimensions
                canvas.width = width;
                canvas.height = height;

                // Configure canvas for better image quality
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = "high";

                // Draw and compress image
                ctx.drawImage(img, 0, 0, width, height);

                // Convert to data URL with specified quality
                const dataURL = canvas.toDataURL(mimeType, quality);

                // Cleanup
                img.onload = null;
                img.onerror = null;

                resolve(dataURL);
            } catch (error) {
                reject(new Error(`Compression failed: ${error.message}`));
            }
        };

        img.onerror = () => {
            reject(new Error("Failed to load image"));
        };

        // Start loading image
        const reader = new FileReader();
        reader.onload = (e) => {
            img.src = e.target?.result as string;
        };
        reader.onerror = () => {
            reject(new Error("Failed to read file"));
        };
        reader.readAsDataURL(file);
    });
};

/**
 * Get image dimensions without loading the full image
 * @param {File} file - Image file
 * @returns {Promise<{width: number, height: number}>}
 */
export const getImageDimensions = (file) => {
    return new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = () => {
            resolve({
                width: img.naturalWidth,
                height: img.naturalHeight,
            });
            img.onload = null;
            img.onerror = null;
        };

        img.onerror = () => {
            reject(new Error("Failed to load image for dimensions"));
        };

        const reader = new FileReader();
        reader.onload = (e) => {
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    });
};

/**
 * Validate image file and get info
 * @param {File} file - Image file
 * @returns {Promise<{size: number, type: string, dimensions: {width: number, height: number}}>}
 */
export const getImageInfo = async (file) => {
    if (!file?.type?.startsWith("image/")) {
        throw new Error("Invalid image file");
    }

    const dimensions = await getImageDimensions(file);

    return {
        size: file.size,
        type: file.type,
        dimensions,
    };
};

// Compatibility wrapper for existing compressorjs API
export const createCompression = (file: File, options: any = {}) => {
    return compressImage(file, {
        quality: options.quality || 0.6,
        maxWidth: options.maxWidth || 150,
        maxHeight: options.maxHeight || 150,
        mimeType: options.mimeType,
    });
};

export default {
    compressImage,
    getImageDimensions,
    getImageInfo,
    createCompression,
};
