import { Trans } from "@lingui/macro";
import { useEffect, useState } from "preact/hooks";

import { menuGroups, plugins } from "../../config";
import { useSession } from "../../utils/queries";
import { MenuGroup } from "./MenuGroup";

export interface ModernMenuProps {
    opened: boolean;
    toggle: () => void;
}

export const ModernMenu = ({ opened, toggle }: ModernMenuProps) => {
    const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(
        new Set()
    );
    const { data: session } = useSession();

    // Group plugins by menuGroup with smart organization
    const groupedPlugins = plugins
        .filter((plugin) => {
            // Basic filters
            if (
                !(
                    plugin.page &&
                    plugin.menu &&
                    plugin.menu !== null &&
                    plugin.name
                )
            ) {
                return false;
            }

            // Authentication filter - hide community protected items for non-root users
            if (plugin.isCommunityProtected && session?.username !== "root") {
                return false;
            }

            return true;
        })
        .reduce((groups, plugin) => {
            const group = plugin.menuGroup || "default";
            if (!groups[group]) {
                groups[group] = [];
            }
            groups[group].push(plugin.menu);
            return groups;
        }, {} as Record<string, any[]>);

    // Sort groups by priority
    const sortedGroups = Object.entries(groupedPlugins).sort(([a], [b]) => {
        const priorityA = menuGroups[a]?.priority || 999;
        const priorityB = menuGroups[b]?.priority || 999;
        return priorityA - priorityB;
    });

    // Handle group toggle
    const handleGroupToggle = (groupKey: string) => {
        setCollapsedGroups((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(groupKey)) {
                newSet.delete(groupKey);
            } else {
                newSet.add(groupKey);
            }
            return newSet;
        });
    };

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!opened) return;

            switch (e.key) {
                case "Escape":
                    toggle();
                    break;
                case "Tab":
                    // Allow normal tab navigation
                    break;
                default:
                    break;
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [opened, toggle]);

    // Focus management
    useEffect(() => {
        if (opened) {
            // Focus the first interactive element when menu opens
            const firstButton = document.querySelector(
                ".menu-container button"
            );
            if (firstButton) {
                (firstButton as HTMLElement).focus();
            }
        }
    }, [opened]);

    return (
        <>
            {/* Overlay */}
            {opened && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
                    onClick={toggle}
                    aria-hidden="true"
                />
            )}

            {/* Menu Container */}
            <div
                className={`
                    menu-container fixed top-0 left-0 h-full z-50
                    bg-gradient-to-b from-gray-50 to-white
                    shadow-2xl border-r border-gray-200
                    transform transition-all duration-300 ease-in-out
                    ${opened ? "translate-x-0" : "-translate-x-full"}
                    w-80 sm:w-96 md:w-80 lg:w-96
                    will-change-transform
                    flex flex-col
                `}
                role="navigation"
                aria-label="Main menu"
                aria-hidden={!opened}
            >
                {/* Menu Header */}
                <div className="p-4 border-b border-gray-200 bg-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                <Trans>Navigation</Trans>
                            </h2>
                            <p className="text-sm text-gray-500">
                                <Trans>Manage your LibreMesh network</Trans>
                            </p>
                        </div>
                        <button
                            onClick={toggle}
                            className="
                                p-2 rounded-full hover:bg-gray-100 
                                transition-colors duration-200
                                focus:outline-none focus:ring-2 focus:ring-primary
                            "
                            aria-label="Close menu"
                        >
                            <svg
                                className="w-5 h-5 text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Menu Content */}
                <div
                    className="flex-1 overflow-y-auto overflow-x-hidden p-4 min-h-0 menu-scrollbar"
                    style={{
                        scrollbarWidth: "thin",
                        scrollbarColor: "#d1d5db transparent",
                    }}
                >
                    <div className="space-y-3">
                        {sortedGroups.map(([groupKey, components]) => {
                            const groupConfig = menuGroups[groupKey];
                            if (!groupConfig) return null;

                            return (
                                <MenuGroup
                                    key={groupKey}
                                    groupKey={groupKey}
                                    groupConfig={groupConfig}
                                    components={components}
                                    isCollapsed={collapsedGroups.has(groupKey)}
                                    onToggle={handleGroupToggle}
                                />
                            );
                        })}
                    </div>
                </div>

                {/* Menu Footer */}
                <div className="p-4 border-t border-gray-200 bg-white">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>
                            <Trans>LibreMesh Network</Trans>
                        </span>
                        <span>
                            <Trans>v4.0</Trans>
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
};
