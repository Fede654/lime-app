import { useState } from "preact/hooks";
import React, { useCallback } from "react";

export type ButtonProps = {
    onClick?: ((e) => void) | ((e) => Promise<void>);
    children?: any; // type error with Trans component
    size?: "sm" | "md" | "lg";
    color?: "primary" | "secondary" | "danger" | "info" | "disabled";
    href?: string;
    outline?: boolean;
    disabled?: boolean;
} & Omit<React.JSX.HTMLAttributes<HTMLDivElement>, "size">;

export const Button = ({
    size = "md",
    color = "primary",
    onClick,
    children,
    href,
    disabled,
    outline = false,
    ...props
}: ButtonProps) => {
    // button internal state to set loading state
    const [innerIsLoading, setInnerIsLoading] = useState(false);

    let sizeClasses = "",
        colorClasses = "";
    switch (size) {
        case "sm":
            sizeClasses = "py-2 px-4 text-sm min-h-[44px]"; // Ensure minimum touch target
            break;
        case "md":
            sizeClasses = "py-3 px-6 min-w-[theme('spacing[52]')] min-h-[44px]";
            break;
        case "lg":
            sizeClasses = "py-4 px-8 min-h-[52px] text-lg";
            break;
    }

    const _color = disabled || innerIsLoading ? "disabled" : color;

    switch (_color) {
        case "secondary":
            colorClasses = outline
                ? "border-2 border-button-secondary text-button-secondary hover:bg-button-secondary hover:text-white"
                : "bg-button-secondary text-white hover:bg-button-primary ";
            break;
        case "danger":
            colorClasses = outline
                ? "border-2 border-danger text-danger hover:bg-danger hover:text-white"
                : "bg-danger text-white border-2 border-danger hover:text-danger hover:bg-white";
            break;
        case "info":
            colorClasses = outline
                ? "border-2 border-button-info text-button-info hover:bg-button-info hover:text-white"
                : "bg-button-info text-white border-2 border-button-info hover:text-button-info hover:bg-white";
            break;
        case "disabled":
            colorClasses = outline
                ? "border-2 border-button-disabled text-button-disabled hover:bg-button-disabled hover:text-white"
                : "bg-button-disabled border-2 border-button-disabled hover:text-button-disabled hover:bg-white";
            break;
        case "primary":
        default:
            colorClasses = outline
                ? "border-2 border-button-primary text-button-primary hover:bg-button-primary hover:text-white"
                : "bg-button-primary text-white hover:bg-button-secondary";
            break;
    }

    const cls = `cursor-pointer font-semibold rounded-xl text-center place-content-center transition-all duration-300
    justify-center border-0 flex items-center active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${sizeClasses}  ${colorClasses}`;

    const handleClick = useCallback(
        async (e) => {
            if (innerIsLoading || disabled || !onClick) return;
            setInnerIsLoading(true);
            try {
                await onClick(e);
            } finally {
                setInnerIsLoading(false);
            }
        },
        [innerIsLoading, disabled, onClick]
    );

    const btn = (
        <div
            type="button"
            onClick={(e) => handleClick(e)}
            className={cls}
            disabled={disabled || innerIsLoading}
            {...props}
        >
            {innerIsLoading && (
                <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            )}
            {children}
        </div>
    );

    if (href) {
        return <a href={href}>{btn}</a>;
    }

    return <>{btn}</>;
};
