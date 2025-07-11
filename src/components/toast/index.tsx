import { ComponentChildren } from "preact";
import { useEffect, useState } from "preact/hooks";

import style from "./style.less";

type ToastType = "success" | "error" | "info";

export interface IToastProps {
    text: ComponentChildren;
    type?: ToastType;
    onHide?: () => void;
    onAction?: () => void;
    actionText?: string;
    duration?: number;
}

const getStyle = (type: ToastType) => {
    switch (type) {
        case "success":
            return style.success;
        case "error":
            return style.error;
        default:
            return "";
    }
};

const Toast = ({
    text,
    type = "info",
    onHide,
    onAction,
    actionText = "Undo",
    duration = 5000,
}: IToastProps) => {
    const [showToast, setShowToast] = useState(true);
    const _onAction = () => {
        if (onAction) onAction();
    };

    const _onHide = () => {
        setShowToast(false);
        if (onHide) onHide();
    };

    // CSS animation replaces react-spring for bundle size optimization

    useEffect(() => {
        if (duration) {
            const timer = setTimeout(() => {
                _onHide();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, _onHide]);

    if (!showToast) return;

    return (
        <div className={style.toastWrapper}>
            <div
                className={`${style.toast} ${style.toastAnimation} ${getStyle(
                    type
                )}`}
                onClick={(e) => {
                    e.stopPropagation();
                    _onHide();
                }}
            >
                <div>{text}</div>
                {onAction && (
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            _onAction();
                        }}
                        className={"text-primary-light"}
                    >
                        {actionText}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Toast;
