import { Trans } from "@lingui/macro";
import { Fragment } from "preact";
import { useState } from "preact/hooks";

import { useBoardData, useLogout, useSession } from "utils/queries";

import { useAppContext } from "../../utils/app.context";
import style from "./style.less";

export const Header = ({ Menu }) => {
    const { data: boardData } = useBoardData();
    const { data: session } = useSession();
    const { mutate: logout } = useLogout();
    const { menuEnabled } = useAppContext();
    const [menuOpened, setMenuOpened] = useState(false);

    function toggleMenu() {
        setMenuOpened((prevValue) => !prevValue);
    }

    function handleLogout() {
        logout();
    }

    return (
        <Fragment>
            <header className={style.header}>
                {boardData && <h1>{boardData.hostname}</h1>}
                {session?.username && (
                    <div className={style.userInfo}>
                        <span className={style.username}>
                            <Trans>User:</Trans> {session.username}
                        </span>
                        <button
                            className={style.logoutButton}
                            onClick={handleLogout}
                        >
                            <Trans>Logout</Trans>
                        </button>
                    </div>
                )}
                {boardData && menuEnabled && (
                    <div
                        className={`${style.hamburger} ${
                            menuOpened ? style.isActive : ""
                        }`}
                        onClick={toggleMenu}
                    >
                        <span>toogle menu</span>
                    </div>
                )}
            </header>
            <Menu opened={menuOpened} toggle={toggleMenu} />
        </Fragment>
    );
};
