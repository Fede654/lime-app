import { Trans } from "@lingui/macro";
import { Fragment } from "preact";
import { route } from "preact-router";
import { useState } from "preact/hooks";

import { useBoardData, useLogin, useLogout, useSession } from "utils/queries";

import { useAppContext } from "../../utils/app.context";
import style from "./style.less";

export const Header = ({ Menu }) => {
    const { data: boardData } = useBoardData();
    const { data: session } = useSession();
    const { mutate: logout } = useLogout();
    const { mutate: login } = useLogin();
    const { menuEnabled } = useAppContext();
    const [menuOpened, setMenuOpened] = useState(false);

    function toggleMenu() {
        setMenuOpened((prevValue) => !prevValue);
    }

    function handleLogout() {
        // Only root can logout, redirect to login page
        if (session?.username === "root") {
            logout(undefined, {
                onSuccess: () => {
                    if (process.env.NODE_ENV !== "production") {
                        console.log(
                            "Root logout successful - redirecting to login"
                        );
                    }
                },
            });
        }
    }

    return (
        <Fragment>
            <header className={style.header}>
                {boardData && (
                    <h1
                        onClick={() => route("/rx")}
                        className="clickable"
                        style={{ cursor: "pointer" }}
                        title="Go to home dashboard"
                    >
                        {boardData.hostname}
                    </h1>
                )}
                {session?.username && (
                    <div className={style.userInfo}>
                        <span className={style.username}>
                            <Trans>User:</Trans> {session.username}
                        </span>
                        {session.username === "root" && (
                            <button
                                className={style.logoutButton}
                                onClick={handleLogout}
                                title="Logout and return to login page"
                            >
                                <Trans>Logout</Trans>
                            </button>
                        )}
                        {session.username === "lime-app" && (
                            <span className={style.guestIndicator}>
                                <Trans>(Guest Access)</Trans>
                            </span>
                        )}
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
