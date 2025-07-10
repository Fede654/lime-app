import * as dotenv from "dotenv";
import * as path from "path";

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

    // Bundle splitting optimization - conservative approach to avoid template issues
    if (isProd) {
        // Preserve existing optimization config and extend it
        const existingOptimization = config.optimization || {};
        config.optimization = {
            ...existingOptimization,
            splitChunks: {
                chunks: "all",
                cacheGroups: {
                    // Simple vendor chunk - all node_modules
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: "vendors",
                        chunks: "all",
                        priority: 10,
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

    // Disable Service Workers completely for smaller builds
    if (config.plugins) {
        config.plugins = config.plugins.filter((plugin) => {
            const name = plugin.constructor.name;
            return (
                name !== "SWPrecacheWebpackPlugin" &&
                name !== "WorkboxPlugin" &&
                name !== "ServiceWorkerPlugin"
            );
        });
    }

    // CSS optimizations are already handled by preact-cli's default config
    // No additional CSS optimization needed as it conflicts with PostCSS setup
}
