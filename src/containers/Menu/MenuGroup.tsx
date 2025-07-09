import { Trans } from "@lingui/macro";
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
    components: any[];
    isCollapsed: boolean;
    onToggle: (groupKey: string) => void;
}

export const MenuGroup = ({ 
    groupKey, 
    groupConfig, 
    components, 
    isCollapsed, 
    onToggle 
}: MenuGroupProps) => {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
        <div className="mb-4">
            {/* Group Header */}
            <button
                onClick={() => onToggle(groupKey)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`
                    w-full flex items-center justify-between p-3 rounded-lg 
                    bg-white shadow-sm border border-gray-200 
                    hover:shadow-md hover:border-primary-300 
                    transition-all duration-200 ease-in-out
                    focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                    ${isHovered ? 'bg-gray-50' : ''}
                `}
                aria-expanded={!isCollapsed}
                aria-controls={`menu-group-${groupKey}`}
                role="button"
            >
                <div className="flex items-center space-x-3">
                    {/* Group Icon */}
                    <div className={`
                        p-2 rounded-lg bg-gradient-to-br 
                        from-primary-100 to-primary-200
                        ${groupConfig.color}
                    `}>
                        <MenuIcon iconName={groupConfig.icon} className="w-5 h-5" />
                    </div>
                    
                    {/* Group Info */}
                    <div className="text-left flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm truncate">
                            <Trans>{groupConfig.label}</Trans>
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">
                            <Trans>{groupConfig.description}</Trans>
                        </p>
                    </div>
                </div>
                
                {/* Collapse Toggle */}
                <div className={`
                    transform transition-transform duration-200 
                    ${isCollapsed ? '' : 'rotate-180'}
                `}>
                    {isCollapsed ? (
                        <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                    ) : (
                        <ChevronUpIcon className="w-5 h-5 text-gray-400" />
                    )}
                </div>
            </button>
            
            {/* Group Items */}
            <div 
                id={`menu-group-${groupKey}`}
                className={`
                    overflow-hidden transition-all duration-300 ease-in-out
                    ${isCollapsed ? 'max-h-0' : 'max-h-96'}
                `}
                aria-hidden={isCollapsed}
            >
                <div className="mt-2 ml-4 space-y-0.5">
                    {components.map((Component, index) => (
                        <div 
                            key={index}
                            className="
                                flex items-center py-2 px-3 rounded-md 
                                hover:bg-gray-50 hover:shadow-sm 
                                transition-all duration-150
                                min-h-[44px] group cursor-pointer
                                border border-transparent hover:border-gray-200
                            "
                        >
                            <div className="
                                flex items-center space-x-3 w-full
                                whitespace-nowrap overflow-hidden text-ellipsis
                            ">
                                <Component />
                            </div>
                            
                            {/* Status indicator placeholder */}
                            <div className="
                                flex-shrink-0 w-2 h-2 rounded-full 
                                bg-gray-300 opacity-0 group-hover:opacity-50
                                transition-opacity duration-200
                            "></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};