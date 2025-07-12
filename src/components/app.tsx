import { fromNavigator } from "@lingui/detect-locale";
import { I18nProvider } from "@lingui/react";
import { QueryClientProvider } from "@tanstack/react-query";
import Router, { route } from "preact-router";
import { useEffect } from "preact/hooks";

import { ToastProvider } from "components/toast/toastProvider";

import { Login } from "containers/Login";
import { Menu } from "containers/Menu";
import { RebootPage } from "containers/RebootPage";
import SubHeader from "containers/SubHeader";

import { AppContextProvider } from "utils/app.context";
import { useBoardData, useLogin, useSession } from "utils/queries";
import queryCache from "utils/queryCache";
import { CommunityProtectedRoute, Redirect, Route } from "utils/routes";

import { plugins } from "../config";
import i18n, { dynamicActivate } from "../i18n";
import { NotFound } from "./NotFound";
import { Header } from "./header";

const Routes = () => {
    return (
        // @ts-ignore
        <Router>
            {/* Login route */}
            <Route path="/login">
                <Login />
            </Route>
            {/* Public pages, don't need to be authenticated */}
            {plugins
                .filter(
                    (plugin) =>
                        !plugin.isCommunityProtected &&
                        plugin.name &&
                        plugin.page
                )
                .map((Component, i) => (
                    <Route
                        key={i}
                        path={Component.name?.toLowerCase() || `route-${i}`}
                    >
                        <Component.page />
                    </Route>
                ))}
            {/* Protected pages, need to be authenticated */}
            {plugins
                .filter((plugin) => plugin.isCommunityProtected && plugin.name)
                .map((Component, i) => (
                    <CommunityProtectedRoute
                        key={i}
                        path={
                            Component.name?.toLowerCase() ||
                            `protected-route-${i}`
                        }
                    >
                        <Component.page />
                    </CommunityProtectedRoute>
                ))}
            {/* Additional plugins routes */}
            {plugins
                .filter((plugin) => plugin.additionalRoutes)
                .map((plugin) => plugin.additionalRoutes)
                .flat()
                .map(([path, Component], index) => (
                    <Route path={path} key={index}>
                        <Component />
                    </Route>
                ))}
            {/* Additional plugins protected routes */}
            {plugins
                .filter((plugin) => plugin.additionalProtectedRoutes)
                .map((plugin) => plugin.additionalProtectedRoutes)
                .flat()
                .map(([path, Component], index) => (
                    <CommunityProtectedRoute path={path} key={index}>
                        <Component />
                    </CommunityProtectedRoute>
                ))}
            <CommunityProtectedRoute path={"/reboot"}>
                <RebootPage />
            </CommunityProtectedRoute>
            {/* @ts-ignore */}
            <Redirect default path={"/"} to={"rx"} />
            {/* 404 fallback route */}
            <Route path="*" default>
                <NotFound />
            </Route>
        </Router>
    );
};

const App = () => {
    const {
        data: session,
        isLoading: sessionLoading,
        isError: sessionError,
    } = useSession();
    const { data: boardData } = useBoardData({
        enabled: session?.username != null,
    });
    const { mutate: login, isError: loginError } = useLogin();
    const [autoLoginAttempted, setAutoLoginAttempted] = useState(false);
    const [autoLoginFailed, setAutoLoginFailed] = useState(false);

    // Auto-login configuration for guest access (restored v3-candidate behavior)
    const AUTO_LOGIN_CONFIG = {
        enabled: true, // Enable auto-login as lime-app user
        username: "lime-app", // LibreMesh guest user (now has proper session ACL access)
        delay: 800, // Delay before auto-login attempt (ms)
        fallbackToLogin: true, // If auto-login fails, show login page instead of error
    };

    // Allow firstbootwizard to render even without session/boardData
    const isOnFbwRoute =
        typeof window !== "undefined" &&
        window.location.hash.includes("firstbootwizard");

    // Allow development mode when running locally without backend
    const isLocalDev =
        typeof window !== "undefined" &&
        (window.location.hostname === "localhost" ||
            window.location.hostname === "127.0.0.1");

    // Check if user is on login page (multiple ways to detect)
    const isOnLoginRoute =
        typeof window !== "undefined" &&
        (window.location.hash.includes("login") ||
            window.location.hash === "#/login");

    // Auto-login as lime-app user for guest access
    useEffect(() => {
        if (
            AUTO_LOGIN_CONFIG.enabled &&
            !sessionLoading &&
            !session?.username &&
            !autoLoginAttempted &&
            !isOnLoginRoute &&
            !isOnFbwRoute &&
            !isLocalDev
        ) {
            setAutoLoginAttempted(true);
            
            // Attempt auto-login after a short delay
            setTimeout(() => {
                if (process.env.NODE_ENV !== "production") {
                    console.log(`Auto-login as ${AUTO_LOGIN_CONFIG.username} for guest access`);
                }
                login(
                    {
                        username: AUTO_LOGIN_CONFIG.username,
                        password: "lime-app", // Default lime-app password (ACL fixed)
                    },
                    {
                        onError: (error) => {
                            if (process.env.NODE_ENV !== "production") {
                                console.warn(`Auto-login failed: ${error.message}. This system may not have lime-app user configured.`);
                            }
                            setAutoLoginFailed(true);
                        },
                        onSuccess: () => {
                            if (process.env.NODE_ENV !== "production") {
                                console.log(`Auto-login successful as ${AUTO_LOGIN_CONFIG.username}`);
                            }
                        }
                    }
                );
            }, AUTO_LOGIN_CONFIG.delay);
        }
    }, [session, sessionLoading, autoLoginAttempted, isOnLoginRoute, isOnFbwRoute, isLocalDev, login]);

    // If not authenticated and not on login/fbw routes, redirect to login
    // This now happens only if auto-login is disabled or failed
    useEffect(() => {
        // Only redirect after session check is complete and auto-login attempted or failed
        if (
            !sessionLoading &&
            (sessionError || !session?.username) &&
            !isOnFbwRoute &&
            !isOnLoginRoute &&
            (!AUTO_LOGIN_CONFIG.enabled || autoLoginAttempted || autoLoginFailed)
        ) {
            // If auto-login failed and fallback is enabled, redirect to login
            if (autoLoginFailed && AUTO_LOGIN_CONFIG.fallbackToLogin) {
                route("/login?auto_login_failed=true", true);
            }
            // If auto-login not attempted or disabled, redirect normally
            else if (!AUTO_LOGIN_CONFIG.enabled || autoLoginAttempted) {
                route("/login", true);
            }
        }
    }, [session, sessionLoading, sessionError, isOnFbwRoute, isOnLoginRoute, autoLoginAttempted, autoLoginFailed]);

    // Show loading while checking session or attempting auto-login
    if (sessionLoading || (AUTO_LOGIN_CONFIG.enabled && !autoLoginAttempted && !autoLoginFailed && !session?.username && !isOnLoginRoute && !isOnFbwRoute && !isLocalDev)) {
        return <div>Loading...</div>;
    }

    // Always show login page if on login route - regardless of session state
    if (isOnLoginRoute) {
        return (
            <div id="app">
                <Routes />
            </div>
        );
    }

    // If no valid session and not on special routes, show login page directly
    if ((!session?.username || !boardData) && !isOnFbwRoute && !isLocalDev) {
        return (
            <div id="app">
                <Routes />
            </div>
        );
    }

    return (
        <div id="app">
            <Header Menu={Menu} />
            <SubHeader />
            <div id="content">
                <Routes />
            </div>
        </div>
    );
};

const AppDefault = () => {
    // Initialize i18n synchronously before rendering
    if (!i18n.locale || i18n.locale === "") {
        // Load empty messages for English as fallback
        i18n.load("en", {});
        i18n.activate("en");
    }

    useEffect(() => {
        // Load dynamic locale after initial render
        try {
            const locale = (fromNavigator()?.split("-")[0] as Locales) || "en";
            dynamicActivate(locale);
        } catch (error) {
            console.warn("i18n dynamic activation error:", error);
            // Fallback to English with empty messages
            i18n.load("en", {});
            i18n.activate("en");
        }
    }, []);
    return (
        <I18nProvider i18n={i18n}>
            <QueryClientProvider client={queryCache}>
                <AppContextProvider>
                    <ToastProvider>
                        <App />
                    </ToastProvider>
                </AppContextProvider>
            </QueryClientProvider>
        </I18nProvider>
    );
};

export default AppDefault;
