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
        <div className="flex items-center gap-x-4 ml-8 mt-6 mb-4">
            <span className={"text-primary-600 fill-current"}>{icon}</span>
            <h1 className="text-3xl font-semibold text-left">{children}</h1>
        </div>
    );
};

export const Section = ({ className, ...props }) => {
    return (
        <div className={"w-full container mb-8"}>
            <div
                className={`w-full bg-white rounded-lg shadow-sm border-2 border-primary-600 py-6 ${className || ''}`}
                {...props}
            >
                {props.children}
            </div>
        </div>
    );
};
