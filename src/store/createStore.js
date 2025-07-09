import { routerMiddleware } from "react-router-redux";
import { applyMiddleware, compose, createStore } from "redux";
import { createEpicMiddleware } from "redux-observable";
import { from } from "rxjs";

import uhttpdService from "../utils/uhttpd.service";
import { history } from "./history";

const api = {
    call: (...params) => from(uhttpdService.call(...params)),
};

export default (initialState, rootEpics, rootReducers) => {
    const composeEnhancers =
        process.env.NODE_ENV === "development" &&
        // @ts-ignore
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
            ? // @ts-ignore
              window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
            : compose;

    const reduxRouterMiddleware = routerMiddleware(history);

    const epicMiddleware = createEpicMiddleware({
        dependencies: { wsAPI: api },
    });

    const enhancer = composeEnhancers(
        applyMiddleware(...[reduxRouterMiddleware, epicMiddleware])
    );

    const store = createStore(rootReducers, initialState, enhancer);

    epicMiddleware.run(rootEpics);

    return store;
};
