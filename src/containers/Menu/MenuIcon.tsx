import { StatusIcon } from "components/icons/teenny/status";
import { AdjustVertical } from "components/icons/teenny/adjust";
import { MapIcon } from "components/icons/teenny/map";
import { GlobeAmericasIcon } from "components/icons/teenny/globe";

interface MenuIconProps {
    iconName: string;
    className?: string;
}

export const MenuIcon = ({ iconName, className = "w-5 h-5" }: MenuIconProps) => {
    const iconMap = {
        status: StatusIcon,
        settings: AdjustVertical,
        map: MapIcon,
        adjust: AdjustVertical,
        globe: GlobeAmericasIcon,
    };

    const IconComponent = iconMap[iconName];
    
    if (!IconComponent) {
        // Fallback to generic icon
        return (
            <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        );
    }

    return <IconComponent className={className} />;
};