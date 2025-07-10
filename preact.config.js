import * as dotenv from "dotenv";
import * as path from "path";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

dotenv.config();

/**
 * Function that mutates original webpack config.
 * Supports asynchronous changes when promise is returned.
 *
 * @param {object} config - original webpack config.
 * @param {object} env - options passed to CLI.
 * @param {WebpackConfigHelpers} helpers - object with useful helpers when working with config.
 **/
export default function (config, env, helpers) {
    // Basepath of lime-app in the router: http://thisnode.info/app/
    // This hack let us use less-modules at plugins/containers directories too
    const { source, isProd } = env;
    // Allow overriding production path for local development serve
    const useLocalPaths = process.env.LOCAL_SERVE === "true";
    config.output.publicPath = isProd && !useLocalPaths ? "/app/" : "";

    const host = process.env.NODE_HOST || "localhost";
    config.devServer = {
        ...config.devServer,
        historyApiFallback: {
            index: isProd && !useLocalPaths ? "/app/" : "/",
        },
        proxy: [
            {
                path: "/ubus",
                target: `http://${host}/`,
            },
            {
                path: "/cgi-bin/**",
                target: `http://${host}/`,
            },
        ],
    };
    const loaderRules = helpers.getLoadersByName(config, "css-loader");
    loaderRules.forEach(({ rule }) => {
        if (rule.include) {
            rule.include.push(source("../plugins"));
            rule.include.push(source("containers"));
        }
        if (rule.exclude) {
            rule.exclude.push(source("../plugins"));
            rule.exclude.push(source("containers"));
        }
    });
    // Add common imports aliases
    (config.resolve.alias["~"] = path.resolve(__dirname, "src")),
        (config.resolve.alias.components = path.resolve(
            __dirname,
            "src/components"
        ));
    config.resolve.alias.containers = path.resolve(__dirname, "src/containers");
    config.resolve.alias.utils = path.resolve(__dirname, "src/utils");
    config.resolve.alias.plugins = path.resolve(__dirname, "plugins");

    // Suppress timeago.js source map warnings
    config.stats = {
        ...config.stats,
        warningsFilter: [
            /Failed to parse source map.*timeago\.js/,
            /ENOENT.*timeago\.js/,
        ],
    };

    // Advanced bundle splitting optimization
    if (isProd) {
        const existingOptimization = config.optimization || {};
        config.optimization = {
            ...existingOptimization,
            splitChunks: {
                chunks: "all",
                maxInitialRequests: 25,
                maxAsyncRequests: 25,
                minSize: 20000,
                maxSize: 244000,
                cacheGroups: {
                    // Framework code (Preact, React compatibility, TanStack Query)
                    framework: {
                        test: /[\\/]node_modules[\\/](preact|@tanstack|@lingui)[\\/]/,
                        name: "framework",
                        chunks: "all",
                        priority: 40,
                        enforce: true,
                    },
                    // Map libraries (heavy dependencies)
                    maps: {
                        test: /[\\/]node_modules[\\/](leaflet|react-leaflet)[\\/]/,
                        name: "maps",
                        chunks: "all",
                        priority: 30,
                        enforce: true,
                    },
                    // Animation libraries
                    animations: {
                        test: /[\\/]node_modules[\\/](react-spring)[\\/]/,
                        name: "animations",
                        chunks: "all",
                        priority: 25,
                        enforce: true,
                    },
                    // Forms
                    forms: {
                        test: /[\\/]node_modules[\\/](react-hook-form)[\\/]/,
                        name: "forms",
                        chunks: "all",
                        priority: 20,
                        enforce: true,
                    },
                    // All other vendors
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: "vendors",
                        chunks: "all",
                        priority: 10,
                        minChunks: 1,
                    },
                    // Plugin chunks by group
                    pluginsStatus: {
                        test: /[\\/]plugins[\\/]lime-plugin-(rx|metrics|locate)[\\/]/,
                        name: "plugins-status",
                        chunks: "all",
                        priority: 15,
                        minChunks: 1,
                    },
                    pluginsMaps: {
                        test: /[\\/]plugins[\\/]lime-plugin-(mesh-wide|locate)[\\/]/,
                        name: "plugins-maps",
                        chunks: "all",
                        priority: 15,
                        minChunks: 1,
                    },
                    pluginsAdmin: {
                        test: /[\\/]plugins[\\/]lime-plugin-(node-admin|network-admin|firmware)[\\/]/,
                        name: "plugins-admin",
                        chunks: "all",
                        priority: 15,
                        minChunks: 1,
                    },
                },
            },
        };
    }

    // Disable Critters plugin to fix CSS parsing error
    if (isProd) {
        const crittersPlugins = helpers.getPluginsByName(
            config,
            "CrittersPlugin"
        );
        if (crittersPlugins.length > 0) {
            config.plugins = config.plugins.filter(
                (plugin) => !crittersPlugins.some((cp) => cp.plugin === plugin)
            );
        }
        // Also try filtering by constructor name and package name
        config.plugins = config.plugins.filter((plugin) => {
            const name = plugin.constructor.name;
            const pkg =
                (plugin.constructor && plugin.constructor.pluginName) || "";
            return (
                name !== "CrittersPlugin" &&
                name !== "Critters" &&
                !pkg.includes("critters")
            );
        });
    }

    // Production optimizations
    if (isProd) {
        // Tree shaking improvements
        config.resolve.mainFields = ["module", "main"];

        // Minimize console output in production
        if (config.optimization.minimizer && config.optimization.minimizer[0]) {
            const terserOptions = config.optimization.minimizer[0].options;
            if (terserOptions && terserOptions.terserOptions) {
                terserOptions.terserOptions.compress = {
                    ...terserOptions.terserOptions.compress,
                    drop_console: true,
                    drop_debugger: true,
                    pure_funcs: [
                        "console.log",
                        "console.info",
                        "console.debug",
                    ],
                };
            }
        }
    }

    // Add bundle analyzer in analyze mode
    if (process.env.ANALYZE === "true") {
        config.plugins.push(
            new BundleAnalyzerPlugin({
                analyzerMode: "server",
                analyzerPort: 8888,
                openAnalyzer: true,
            })
        );
    }
}
