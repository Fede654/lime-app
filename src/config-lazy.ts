import { lazy } from "preact/compat";

// LAZY LOADED PLUGINS - High Impact Bundle Size Optimization
// Plugins are loaded on-demand when their routes are accessed

// Define lazy-loaded plugin modules
const lazyPlugins = {
    Align: lazy(() => import("plugins/lime-plugin-align")),
    ChangeNode: lazy(() => import("plugins/lime-plugin-changeNode")),
    Fbw: lazy(() => import("plugins/lime-plugin-fbw")),
    Firmware: lazy(() => import("plugins/lime-plugin-firmware")),
    Locate: lazy(() => import("plugins/lime-plugin-locate")),
    MeshWide: lazy(() => import("plugins/lime-plugin-mesh-wide")),
    MeshConfigPage: lazy(() => import("plugins/lime-plugin-mesh-wide-config")),
    MeshUpgrade: lazy(() => import("plugins/lime-plugin-mesh-wide-upgrade")),
    Metrics: lazy(() => import("plugins/lime-plugin-metrics")),
    NetworkAdmin: lazy(() => import("plugins/lime-plugin-network-admin")),
    NodeAdmin: lazy(() => import("plugins/lime-plugin-node-admin")),
    Notes: lazy(() => import("plugins/lime-plugin-notes")),
    Pirania: lazy(() => import("plugins/lime-plugin-pirania")),
    RemoteSupport: lazy(() => import("plugins/lime-plugin-remotesupport")),
    Rx: lazy(() => import("plugins/lime-plugin-rx")),
};

// Helper to create lazy plugin configuration
const createLazyPlugin = (
    pluginKey: keyof typeof lazyPlugins,
    config: {
        menuGroup?: string;
        isCommunityProtected?: boolean;
        name?: string;
        path?: string;
    }
): LazyLimePlugin => ({
    ...config,
    name: config.name || pluginKey,
    component: lazyPlugins[pluginKey],
    isLazy: true,
});

// REGISTER LAZY PLUGINS WITH SMART GROUPING
export const plugins: (LimePlugin | LazyLimePlugin)[] = [
    // Network Status Group (PUBLIC - accessible to lime-app user)
    createLazyPlugin("Rx", { menuGroup: "status" }),
    createLazyPlugin("Metrics", { menuGroup: "status" }),
    createLazyPlugin("Locate", { menuGroup: "status" }),

    // Administration Group (PROTECTED - requires root authentication)
    createLazyPlugin("NodeAdmin", {
        menuGroup: "administration",
        isCommunityProtected: true,
    }),
    createLazyPlugin("NetworkAdmin", {
        menuGroup: "administration",
        isCommunityProtected: true,
    }),
    createLazyPlugin("Firmware", {
        menuGroup: "administration",
        isCommunityProtected: true,
    }),

    // Mesh Network Group (PROTECTED - requires root authentication)
    createLazyPlugin("MeshWide", {
        menuGroup: "meshwide",
        isCommunityProtected: true,
    }),
    createLazyPlugin("MeshConfigPage", {
        menuGroup: "meshwide",
        isCommunityProtected: true,
    }),
    createLazyPlugin("MeshUpgrade", {
        menuGroup: "meshwide",
        isCommunityProtected: true,
    }),

    // Tools & Utilities Group (MIXED - some public, some protected)
    createLazyPlugin("Align", { menuGroup: "tools" }), // Public - network alignment info
    createLazyPlugin("ChangeNode", { menuGroup: "tools" }), // Public - change connected node
    createLazyPlugin("RemoteSupport", {
        menuGroup: "tools",
        isCommunityProtected: true,
    }), // Protected - remote access

    // Community Group (PUBLIC - community features)
    createLazyPlugin("Notes", { menuGroup: "community" }),
    createLazyPlugin("Pirania", {
        menuGroup: "community",
        isCommunityProtected: true,
    }), // Protected - captive portal config

    // No menu item
    createLazyPlugin("Fbw", {}),
];

// Menu group configurations (unchanged)
export const menuGroups = {
    status: {
        label: "Network Status",
        description: "Monitor your network performance and connectivity",
        icon: "status",
        color: "text-blue-600",
        priority: 1,
    },
    administration: {
        label: "Administration",
        description: "Manage node settings and system configuration",
        icon: "settings",
        color: "text-red-600",
        priority: 2,
    },
    meshwide: {
        label: "Mesh Network",
        description: "Manage the entire mesh network",
        icon: "map",
        color: "text-green-600",
        priority: 3,
    },
    tools: {
        label: "Tools & Utilities",
        description: "Network tools and diagnostic utilities",
        icon: "adjust",
        color: "text-purple-600",
        priority: 4,
    },
    community: {
        label: "Community",
        description: "Community features and user management",
        icon: "globe",
        color: "text-orange-600",
        priority: 5,
    },
};

// Types for lazy loading support
export interface LazyLimePlugin extends Omit<LimePlugin, "page" | "menu"> {
    component: any; // Lazy component
    isLazy: true;
    page?: any; // Will be resolved from component.default.page
    menu?: any; // Will be resolved from component.default.menu
}

// Helper to check if plugin is lazy
export const isLazyPlugin = (
    plugin: LimePlugin | LazyLimePlugin
): plugin is LazyLimePlugin => {
    return "isLazy" in plugin && plugin.isLazy === true;
};
