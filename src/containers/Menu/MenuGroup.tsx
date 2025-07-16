import { Trans } from "@lingui/macro";
import { route } from "preact-router";
import { useState } from "preact/hooks";

import { ChevronDownIcon } from "components/icons/teenny/chevron-down";
import { ChevronUpIcon } from "components/icons/teenny/chevron-up";

import { MenuIcon } from "./MenuIcon";

export interface MenuGroupProps {
    groupKey: string;
    groupConfig: {
        label: string;
        description: string;
        icon: string;
        color: string;
        priority: number;
    };
    components: Array<{
        component: () => JSX.Element;
        name: string;
    }>;
    isCollapsed: boolean;
    onToggle: (groupKey: string) => void;
    onCloseMenu?: () => void;
}

export const MenuGroup = ({
    groupKey,
    groupConfig,
    components,
    isCollapsed,
    onToggle,
    onCloseMenu,
}: MenuGroupProps) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className="mb-6">
            {/* Group Header */}
            <button
                onClick={() => onToggle(groupKey)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`
                    w-full flex items-center justify-between p-4 rounded-xl 
                    bg-white shadow-sm border border-gray-200 
                    hover:shadow-md hover:border-primary-300 hover:bg-gray-50
                    transition-all duration-200 ease-in-out
                    focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                    ${isHovered ? "transform scale-[1.01]" : ""}
                `}
                aria-expanded={!isCollapsed}
                aria-controls={`menu-group-${groupKey}`}
                role="button"
            >
                <div className="flex items-center space-x-4">
                    {/* Group Icon */}
                    <div
                        className={`
                        p-3 rounded-xl bg-gradient-to-br 
                        from-primary-100 to-primary-200
                        shadow-sm
                        ${groupConfig.color}
                    `}
                    >
                        <MenuIcon
                            iconName={groupConfig.icon}
                            className="w-7 h-7 text-primary-700"
                        />
                    </div>

                    {/* Group Info */}
                    <div className="text-left flex-1 min-w-0">
                        <h3 className="text-2xl font-bold text-gray-900 truncate">
                            <Trans>{groupConfig.label}</Trans>
                        </h3>
                    </div>
                </div>

                {/* Collapse Toggle */}
                <div
                    className={`
                    transform transition-transform duration-200 
                    p-1 rounded-full hover:bg-white/50
                    ${isCollapsed ? "" : "rotate-180"}
                `}
                >
                    {isCollapsed ? (
                        <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                    ) : (
                        <ChevronUpIcon className="w-5 h-5 text-gray-500" />
                    )}
                </div>
            </button>

            {/* Group Items */}
            <div
                id={`menu-group-${groupKey}`}
                className={`
                    overflow-hidden transition-all duration-300 ease-in-out
                    ${
                        isCollapsed
                            ? "max-h-0 opacity-0"
                            : "max-h-[1000px] opacity-100"
                    }
                `}
                aria-hidden={isCollapsed}
            >
                <div className="mt-3 ml-1 mr-1 space-y-1 overflow-hidden">
                    {components.map((item, index) => {
                        const { component: Component, name } = item;

                        return (
                            <div
                                key={index}
                                className="
                                    flex items-center py-3 px-5 rounded-lg 
                                    hover:bg-gradient-to-r hover:from-gray-50 hover:to-primary-50
                                    hover:shadow-sm hover:border-primary-200
                                    transition-all duration-200
                                    min-h-[52px] group
                                    border border-transparent 
                                    overflow-hidden cursor-pointer
                                    focus-within:ring-2 focus-within:ring-primary-400 focus-within:ring-offset-1
                                    active:scale-[0.98] active:shadow-inner
                                "
                                onClick={(e) => {
                                    e.preventDefault();
                                    // Navigate using the plugin name
                                    const routePath = `/${name.toLowerCase()}`;
                                    route(routePath);
                                    onCloseMenu?.();
                                }}
                            >
                                <div className="flex items-center flex-1 min-w-0 overflow-hidden pointer-events-none">
                                    <Component />
                                </div>

                                {/* Enhanced navigation indicator */}
                                <div className="flex items-center space-x-2 flex-shrink-0">
                                    {/* Subtle arrow indicator */}
                                    <svg
                                        className="
                                        w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-70
                                        transition-all duration-200
                                        transform translate-x-1 group-hover:translate-x-0
                                        "
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
