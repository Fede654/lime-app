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
import { useBoardData, useLogin, useSession } from "utils/queries";
import queryCache from "utils/queryCache";
import { CommunityProtectedRoute, Redirect, Route } from "utils/routes";

import { plugins } from "../config";
import i18n, { dynamicActivate } from "../i18n";
import { NotFound } from "./NotFound";
import { Header } from "./header";

// Import Leaflet for map components in development
if (process.env.NODE_ENV === "development") {
    import("leaflet").then((L) => {
        if (typeof window !== "undefined") {
            window.L = L.default;
        }
    });
}

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

    // If not authenticated and not on login/fbw routes, redirect to login
    useEffect(() => {
        // Only redirect after session check is complete (not loading)
        if (
            !sessionLoading &&
            (sessionError || !session?.username) &&
            !isOnFbwRoute &&
            !isOnLoginRoute
        ) {
            route("/login", true);
        }
    }, [session, sessionLoading, sessionError, isOnFbwRoute, isOnLoginRoute]);

    // Show loading while checking session
    if (sessionLoading) {
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
    const [i18nReady, setI18nReady] = useState(false);

    useEffect(() => {
        // Initialize i18n before rendering
        const initializeLocale = async () => {
            try {
                // Ensure i18n is activated before rendering
                if (!i18n.locale || i18n.locale === "") {
                    // Synchronous activation to prevent I18nProvider warning
                    // Add basic plural rules for English to avoid warnings
                    i18n.loadLocaleData({
                        en: {
                            plurals: (n: number, ordinal: boolean) => {
                                if (ordinal) return n === 1 ? 'one' : n === 2 ? 'two' : n === 3 ? 'few' : 'other';
                                return n === 1 ? 'one' : 'other';
                            }
                        }
                    });
                    i18n.load("en", {});
                    i18n.activate("en");
                }
                
                setI18nReady(true);
                
                // Then load proper locale asynchronously
                const locale =
                    (fromNavigator()?.split("-")[0] as Locales) || "en";
                await dynamicActivate(locale);
            } catch (error) {
                if (process.env.NODE_ENV !== "production") {
                    console.warn("i18n dynamic activation error:", error);
                }
                // Fallback: ensure we have a working setup
                if (!i18n.locale) {
                    i18n.load("en", {});
                    i18n.activate("en");
                }
                setI18nReady(true);
            }
        };

        initializeLocale();
    }, []);

    // Don't render until i18n is properly initialized
    if (!i18nReady) {
        return <div>Loading...</div>;
    }

    return (
        <I18nProvider i18n={i18n} forceRenderOnLocaleChange={false}>
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
