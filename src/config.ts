import Align from "plugins/lime-plugin-align";
import ChangeNode from "plugins/lime-plugin-changeNode";
import Fbw from "plugins/lime-plugin-fbw";
import Firmware from "plugins/lime-plugin-firmware";
import GroundRouting from "plugins/lime-plugin-ground-routing";
import Locate from "plugins/lime-plugin-locate";
import MeshWide from "plugins/lime-plugin-mesh-wide";
import MeshConfigPage from "plugins/lime-plugin-mesh-wide-config";
import MeshUpgrade from "plugins/lime-plugin-mesh-wide-upgrade";
import Metrics from "plugins/lime-plugin-metrics";
import NetworkAdmin from "plugins/lime-plugin-network-admin";
import NodeAdmin from "plugins/lime-plugin-node-admin";
import Notes from "plugins/lime-plugin-notes";
import Pirania from "plugins/lime-plugin-pirania";
import RemoteSupport from "plugins/lime-plugin-remotesupport";
import Rx from "plugins/lime-plugin-rx";

// REGISTER PLUGINS WITH SMART GROUPING
export const plugins: LimePlugin[] = [
    // Network Status Group
    { ...Rx, menuGroup: "status" },
    { ...Metrics, menuGroup: "status" },
    { ...Locate, menuGroup: "status" },

    // Administration Group
    { ...NodeAdmin, menuGroup: "administration" },
    { ...NetworkAdmin, menuGroup: "administration" },
    { ...Firmware, menuGroup: "administration" },

    // Mesh Network Group
    { ...MeshWide, menuGroup: "meshwide" },
    { ...MeshConfigPage, menuGroup: "meshwide" },
    { ...MeshUpgrade, menuGroup: "meshwide" },

    // Tools & Utilities Group
    { ...Align, menuGroup: "tools" },
    { ...ChangeNode, menuGroup: "tools" },
    { ...GroundRouting, menuGroup: "tools" },
    { ...RemoteSupport, menuGroup: "tools" },

    // Community Group
    { ...Notes, menuGroup: "community" },
    { ...Pirania, menuGroup: "community" },

    // No menu item
    Fbw,
];

// Menu group configurations
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
