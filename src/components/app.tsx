import { fromNavigator } from "@lingui/detect-locale";
import { I18nProvider } from "@lingui/react";
import { QueryClientProvider } from "@tanstack/react-query";
import Router, { route } from "preact-router";
import { useEffect, useState } from "preact/hooks";

import { ToastProvider } from "components/toast/toastProvider";

import { Login } from "containers/Login";
import { Menu } from "containers/Menu";
import { RebootPage } from "containers/RebootPage";
import SubHeader from "containers/SubHeader";

import { AppContextProvider } from "utils/app.context";
import { logAuthEvent } from "utils/logger";
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
    const [autoLoginInProgress, setAutoLoginInProgress] = useState(false);

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
            !autoLoginInProgress &&
            !isOnLoginRoute &&
            !isOnFbwRoute &&
            !isLocalDev
        ) {
            setAutoLoginAttempted(true);
            setAutoLoginInProgress(true);

            // Attempt auto-login after a short delay
            setTimeout(() => {
                // Double-check conditions before attempting login to prevent duplicates
                if (session?.username || autoLoginInProgress) {
                    logAuthEvent("auto_login", {
                        status: "cancelled",
                        reason: "session_exists_or_in_progress",
                    });
                    setAutoLoginInProgress(false);
                    return;
                }

                logAuthEvent("auto_login", {
                    username: AUTO_LOGIN_CONFIG.username,
                });
                login(
                    {
                        username: AUTO_LOGIN_CONFIG.username,
                        password: "generic", // Default lime-app password (ACL fixed)
                    },
                    {
                        onError: (error: any) => {
                            // Use centralized logging for auth failures
                            const errorDetails = {
                                message: error?.message,
                                status: error?.status,
                                endpoint: error?.endpoint,
                            };

                            // Handle specific error codes with helpful context
                            if (error?.result?.[0] === 6) {
                                logAuthEvent("login_failure", {
                                    ...errorDetails,
                                    code: 6,
                                    reason: "permission_denied",
                                    suggestion:
                                        "Update ACL file with session permissions and rebuild LibreMesh",
                                });
                            } else {
                                logAuthEvent("login_failure", errorDetails);
                            }

                            setAutoLoginFailed(true);
                            setAutoLoginInProgress(false);
                        },
                        onSuccess: () => {
                            logAuthEvent("login_success", {
                                username: AUTO_LOGIN_CONFIG.username,
                                type: "auto_login",
                            });
                            setAutoLoginInProgress(false);
                        },
                    }
                );
            }, AUTO_LOGIN_CONFIG.delay);
        }
    }, [
        session,
        sessionLoading,
        autoLoginAttempted,
        autoLoginInProgress,
        isOnLoginRoute,
        isOnFbwRoute,
        isLocalDev,
        login,
    ]);

    // Reset auto-login state when session changes (after logout)
    useEffect(() => {
        // If session becomes null/undefined after being authenticated, reset auto-login state
        if (
            !sessionLoading &&
            !session?.username &&
            autoLoginAttempted &&
            !autoLoginInProgress
        ) {
            logAuthEvent("logout", {
                reason: "session_cleared",
                reset_auto_login: true,
            });
            setAutoLoginAttempted(false);
            setAutoLoginFailed(false);
        }
    }, [session, sessionLoading, autoLoginAttempted, autoLoginInProgress]);

    // If not authenticated and not on login/fbw routes, redirect to login
    // This now happens only if auto-login is disabled or failed
    useEffect(() => {
        // Only redirect after session check is complete and auto-login attempted or failed
        if (
            !sessionLoading &&
            !autoLoginInProgress &&
            (sessionError || !session?.username) &&
            !isOnFbwRoute &&
            !isOnLoginRoute &&
            (!AUTO_LOGIN_CONFIG.enabled ||
                autoLoginAttempted ||
                autoLoginFailed)
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
    }, [
        session,
        sessionLoading,
        sessionError,
        isOnFbwRoute,
        isOnLoginRoute,
        autoLoginAttempted,
        autoLoginFailed,
        autoLoginInProgress,
    ]);

    // Show loading while checking session or attempting auto-login
    if (
        sessionLoading ||
        autoLoginInProgress ||
        (AUTO_LOGIN_CONFIG.enabled &&
            !autoLoginAttempted &&
            !autoLoginFailed &&
            !session?.username &&
            !isOnLoginRoute &&
            !isOnFbwRoute &&
            !isLocalDev)
    ) {
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
        // Load empty messages for English as fallback with basic plural rules
        i18n.loadLocaleData({
            en: {
                plurals: (n: number) => (n === 1 ? "one" : "other") as any, // Basic English plural rule
            },
        });
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
