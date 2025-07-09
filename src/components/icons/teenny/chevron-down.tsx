interface ChevronDownIconProps {
    className?: string;
    size?: string;
}

export const ChevronDownIcon = ({
    className = "w-5 h-5",
    size,
}: ChevronDownIconProps) => (
    <svg
        className={size || className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
        />
    </svg>
);
