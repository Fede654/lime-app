import { Trans } from "@lingui/macro";
import { route } from "preact-router";
import { useEffect, useState } from "preact/hooks";

import Loading from "components/loading";

import { useLogin, useSession } from "utils/queries";

import styles from "./login.module.less";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const { data: session } = useSession();
    const { mutate: login, isLoading, isError, error } = useLogin();

    // Redirect if already logged in
    useEffect(() => {
        if (session?.username) {
            route("/rx", true);
        }
    }, [session]);

    const handleSubmit = (e: Event) => {
        e.preventDefault();
        login({ username, password });
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginBox}>
                <div className={styles.loginHeader}>
                    <h1>
                        <Trans>LiMeApp Login</Trans>
                    </h1>
                    <p className={styles.subtitle}>
                        <Trans>Access your LibreMesh network interface</Trans>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className={styles.loginForm}>
                    <div className={styles.formGroup}>
                        <label htmlFor="username">
                            <Trans>Username</Trans>
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.currentTarget.value)}
                            placeholder="root"
                            required
                            disabled={isLoading}
                            autoFocus
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password">
                            <Trans>Password</Trans>
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.currentTarget.value)}
                            placeholder="••••••••"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className={styles.rememberGroup}>
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.currentTarget.checked)}
                                disabled={isLoading}
                            />
                            <span>
                                <Trans>Remember me</Trans>
                            </span>
                        </label>
                    </div>

                    {isError && (
                        <div className={styles.errorMessage}>
                            <Trans>Invalid username or password. Please try again.</Trans>
                        </div>
                    )}

                    <button
                        type="submit"
                        className={styles.loginButton}
                        disabled={isLoading || !username || !password}
                    >
                        {isLoading ? (
                            <>
                                <Loading />
                                <Trans>Logging in...</Trans>
                            </>
                        ) : (
                            <Trans>Login</Trans>
                        )}
                    </button>
                </form>

                <div className={styles.loginHelp}>
                    <p>
                        <Trans>Default credentials:</Trans>
                    </p>
                    <ul>
                        <li>
                            <Trans>Basic access: username "lime-app" (no password)</Trans>
                        </li>
                        <li>
                            <Trans>Full access: username "root" with community password</Trans>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Login;