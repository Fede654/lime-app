// For less files
declare module "*.less" {
    const mapping: Record<string, string>;
    export default mapping;
}

type Locales = "en" | "es" | "pt" | "it";

type LimeRoutes = [string, typeof JSX.Element];

// Redux types
type ReduxAction = {
    type: string;
    payload?: unknown;
};

type ReduxState = Record<string, unknown>;

type ReduxReducer = (state: unknown, action: ReduxAction) => unknown;

// Flexible epic type to accommodate existing implementations
type ReduxEpic = (
    action$: unknown,
    state$: unknown,
    dependencies: unknown
) => unknown;

type ReduxEpics = Record<string, ReduxEpic>;

type ReduxSelector = (state: ReduxState) => unknown;

type ReduxSelectors = Record<string, ReduxSelector>;

type ReduxConstants = Record<string, string>;

interface LimePlugin {
    name: string;
    page: typeof JSX.Element;
    menu: typeof JSX.Element;
    menuView?: string;
    isCommunityProtected?: boolean;
    additionalRoutes?: LimeRoutes[];
    additionalProtectedRoutes?: LimeRoutes[];
    store?: {
        name: string;
        epics?: ReduxEpics;
        reducer?: ReduxReducer;
        selector?: ReduxSelectors;
        constants?: ReduxConstants;
    };
}
