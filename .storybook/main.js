const path = require("path");

module.exports = {
    framework: "@storybook/preact",
    stories: [
        "../stories/**/*stories.js",
        "../stories/**/*stories.ts",
        "../plugins/**/*stories.js",
        "../plugins/**/*stories.ts",
    ],
    addons: [
        "@storybook/addon-actions",
        "@storybook/addon-controls",
        "@storybook/addon-essentials",
    ],
    features: {
        interactionsDebugger: true,
    },
    webpackFinal: async (config) => {
        // Add path aliases to match preact.config.js
        config.resolve.alias = {
            ...config.resolve.alias,
            "~": path.resolve(__dirname, "../src"),
            components: path.resolve(__dirname, "../src/components"),
            containers: path.resolve(__dirname, "../src/containers"),
            utils: path.resolve(__dirname, "../src/utils"),
            plugins: path.resolve(__dirname, "../plugins"),
        };

        // Add .less file support
        config.resolve.extensions.push(".less");
        config.module.rules.push({
            test: /\.less$/,
            use: [
                "style-loader",
                {
                    loader: "css-loader",
                    options: {
                        modules: {
                            localIdentName: "[name]__[local]___[hash:base64:5]",
                        },
                    },
                },
                "less-loader",
            ],
        });

        return config;
    },
};
