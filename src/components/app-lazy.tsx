import { fromNavigator } from "@lingui/detect-locale";
import { I18nProvider } from "@lingui/react";
import { QueryClientProvider } from "@tanstack/react-query";
import Router, { route } from "preact-router";
import { useEffect, useState } from "preact/hooks";
import { Suspense } from "preact/compat";

import { ToastProvider } from "components/toast/toastProvider";
import LazyRoute from "components/LazyRoute";

import { Login } from "containers/Login";
import { Menu } from "containers/Menu";
import { RebootPage } from "containers/RebootPage";
import SubHeader from "containers/SubHeader";

import { AppContextProvider } from "utils/app.context";
import { logAuthEvent } from "utils/logger";
import { useBoardData, useLogin, useSession } from "utils/queries";
import queryCache from "utils/queryCache";
import { CommunityProtectedRoute, Redirect, Route } from "utils/routes";

import { plugins, isLazyPlugin } from "../config-lazy";
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
                        plugin.name
                )
                .map((plugin, i) => {
                    const path = plugin.name?.toLowerCase() || `route-${i}`;
                    
                    if (isLazyPlugin(plugin)) {
                        return (
                            <Route key={i} path={path}>
                                <LazyRoute 
                                    component={() => {
                                        // Wrapper to extract page component from lazy loaded module
                                        const LazyComponent = ({ ...props }) => {
                                            const [PageComponent, setPageComponent] = useState(null);
                                            
                                            useEffect(() => {
                                                plugin.component().then((module: any) => {
                                                    setPageComponent(() => module.default.page);
                                                });
                                            }, []);
                                            
                                            if (!PageComponent) return null;
                                            return <PageComponent {...props} />;
                                        };
                                        return LazyComponent;
                                    }}
                                />
                            </Route>
                        );
                    } else {
                        return (
                            <Route key={i} path={path}>
                                {(plugin as any).page && <(plugin as any).page />}
                            </Route>
                        );
                    }
                })}
            {/* Protected pages, need to be authenticated */}
            {plugins
                .filter((plugin) => plugin.isCommunityProtected && plugin.name)
                .map((plugin, i) => {
                    const path = plugin.name?.toLowerCase() || `protected-route-${i}`;
                    
                    if (isLazyPlugin(plugin)) {
                        return (
                            <CommunityProtectedRoute key={i} path={path}>
                                <LazyRoute 
                                    component={() => {
                                        // Wrapper to extract page component from lazy loaded module
                                        const LazyComponent = ({ ...props }) => {
                                            const [PageComponent, setPageComponent] = useState(null);
                                            
                                            useEffect(() => {
                                                plugin.component().then((module: any) => {
                                                    setPageComponent(() => module.default.page);
                                                });
                                            }, []);
                                            
                                            if (!PageComponent) return null;
                                            return <PageComponent {...props} />;
                                        };
                                        return LazyComponent;
                                    }}
                                />
                            </CommunityProtectedRoute>
                        );
                    } else {
                        return (
                            <CommunityProtectedRoute key={i} path={path}>
                                {(plugin as any).page && <(plugin as any).page />}
                            </CommunityProtectedRoute>
                        );
                    }
                })}
            
            {/* Additional plugins routes - handle both lazy and regular */}
            {plugins
                .filter((plugin) => plugin.additionalRoutes)
                .map((plugin) => plugin.additionalRoutes)
                .flat()
                .map(([path, Component], index) => (
                    <Route path={path} key={index}>
                        <Component />
                    </Route>
                ))}
                
            {/* Additional plugins protected routes - handle both lazy and regular */}
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
        refetch: sessionRefetch,
        error: sessionError,
    } = useSession();

    const {
        mutate: login,
        isLoading: loginLoading,
        error: loginError,
        data: loginData,
    } = useLogin({
        onSuccess: () => {
            sessionRefetch();
        },
    });

    const [loginErrors, setLoginErrors] = useState<string>("");

    const { data: boardData } = useBoardData();

    const [locale, setLocale] = useState<any>();

    useEffect(() => {
        dynamicActivate(fromNavigator() || "en");
    }, []);

    useEffect(() => {
        if (loginError) {
            logAuthEvent("login_failed", {
                error: loginError?.message || "Unknown error",
            });
            setLoginErrors(loginError?.message || "Login failed");
        }

        if (loginData) {
            logAuthEvent("login_successful");
            setLoginErrors("");
        }
    }, [loginError, loginData]);

    useEffect(() => {
        if (sessionError) {
            logAuthEvent("session_error", {
                error: sessionError?.message || "Unknown error",
            });
        }

        if (session) {
            logAuthEvent("session_established", {
                username: session.username,
            });
        }
    }, [session, sessionError]);

    if (sessionLoading) {
        return (
            <div className="animate-pulse flex space-x-4 p-8">
                <div className="flex-1 space-y-6 py-1">
                    <div className="h-2 bg-slate-200 rounded"></div>
                    <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                            <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                        </div>
                        <div className="h-2 bg-slate-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <QueryClientProvider client={queryCache}>
            <I18nProvider i18n={i18n}>
                <ToastProvider>
                    <AppContextProvider>
                        <div id="app" class="h-screen flex flex-col">
                            <Header hostname={boardData?.hostname} />
                            <SubHeader />
                            <div class="flex flex-1 overflow-hidden">
                                <Menu />
                                <main
                                    id="main-content"
                                    class="flex-1 overflow-y-auto"
                                >
                                    <Suspense
                                        fallback={
                                            <div class="flex items-center justify-center h-64">
                                                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                                            </div>
                                        }
                                    >
                                        <Routes />
                                    </Suspense>
                                </main>
                            </div>
                        </div>
                    </AppContextProvider>
                </ToastProvider>
            </I18nProvider>
        </QueryClientProvider>
    );
};

export default App;