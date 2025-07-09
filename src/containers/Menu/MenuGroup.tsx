import { Trans } from "@lingui/macro";
import { useState } from "preact/hooks";

import { ChevronDownIcon } from "components/icons/teenny/chevron-down";
import { ChevronUpIcon } from "components/icons/teenny/chevron-up";

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
                        <div className="w-5 h-5 flex items-center justify-center">
                            {/* TODO: Add dynamic icon based on groupConfig.icon */}
                            <div className="w-4 h-4 bg-current rounded-sm opacity-75"></div>
                        </div>
                    </div>
                    
                    {/* Group Info */}
                    <div className="text-left">
                        <h3 className="font-semibold text-gray-900 text-sm">
                            <Trans>{groupConfig.label}</Trans>
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
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
                <div className="mt-2 ml-4 space-y-1">
                    {components.map((Component, index) => (
                        <div 
                            key={index}
                            className="
                                flex items-center p-2 rounded-md 
                                hover:bg-gray-50 transition-colors duration-150
                            "
                        >
                            <Component />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};