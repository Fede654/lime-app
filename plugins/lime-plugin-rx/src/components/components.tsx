import { ComponentChildren, FunctionalComponent } from "preact";

export const IconsClassName = "h-14 w-14";

interface SectionTitleProps {
    children?: ComponentChildren;
    icon: ComponentChildren;
}

export const SectionTitle: FunctionalComponent<SectionTitleProps> = ({
    children,
    icon,
}) => {
    return (
        <div className="section-header">
            <span className={"text-primary-600 fill-current icon-enhanced"}>{icon}</span>
            <h1 className="section-title">{children}</h1>
        </div>
    );
};

export const Section = ({ className, ...props }) => {
    return (
        <div className="section-container">
            <div
                className={`dashboard-card backdrop-blur-sm ${className || ''}`}
                {...props}
            >
                {props.children}
            </div>
        </div>
    );
};

// Unified loading component for consistent loading states
export const LoadingCard = ({ message = "Loading..." }: { message?: string }) => {
    return (
        <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center gap-5">
                <div className="spinner-enhanced"></div>
                <div className="text-lg text-primary-600 font-semibold tracking-wide">{message}</div>
            </div>
        </div>
    );
};
