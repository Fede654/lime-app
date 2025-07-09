import { plugins } from "../../config";
import { ModernMenu } from "./ModernMenu";
import style from "./style.less";

export const Menu = ({ opened, toggle }) => {
    // Use modern menu by default, with fallback to legacy menu
    const useModernMenu = true;

    if (useModernMenu) {
        return <ModernMenu opened={opened} toggle={toggle} />;
    }

    // Legacy menu (fallback)
    const groupedPlugins = plugins
        .filter(
            (plugin) =>
                plugin.page &&
                plugin.menu &&
                plugin.menu !== null &&
                plugin.name
        )
        .reduce((groups, plugin) => {
            const group = plugin.menuGroup || "default";
            if (!groups[group]) {
                groups[group] = [];
            }
            groups[group].push(plugin.menu);
            return groups;
        }, {});

    return (
        <div
            className={`${style.menu} ${
                opened ? style.menuOpened : style.menuClosed
            } d-flex flex-column`}
        >
            <nav className={style.menuItemsWrapper} onClick={toggle}>
                {Object.entries(groupedPlugins).map(([group, components]) => (
                    <div key={group} className={style.menuGroup}>
                        {group !== "default" && <hr />}
                        {components.map((Component, index) => (
                            <Component key={index} />
                        ))}
                    </div>
                ))}
            </nav>
        </div>
    );
};
