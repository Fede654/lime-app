import { cloneElement } from "preact";
import { route } from "preact-router";
import { useEffect } from "preact/hooks";

import { useFbwStatus } from "../../plugins/lime-plugin-fbw/src/FbwQueries";
import { FbwBanner } from "../../plugins/lime-plugin-fbw/src/containers/FbwBanner";
import { SharedPasswordLogin } from "../containers/SharedPasswordLogin";
import { useAppContext } from "./app.context";
import { useSession } from "./queries";

export const Route = ({ path, children, ...childrenProps }) => {
    const { data: fbwStatus } = useFbwStatus({
        initialData: { lock: false },
        initialStale: true,
    });
    const { fbwCanceled } = useAppContext();
    const childrenWithProps = cloneElement(children, { ...childrenProps });
    if (
        fbwStatus.lock &&
        !fbwCanceled &&
        path !== "firmware" &&
        path !== "releaseInfo" &&
        !path.startsWith("firstbootwizard")
    ) {
        return <FbwBanner />;
    }

    return childrenWithProps;
};

export const CommunityProtectedRoute = ({
    path,
    children,
    ...childrenProps
}) => {
    const { data: session, isLoading: sessionLoading } = useSession();
    const childrenWithProps = cloneElement(children, { ...childrenProps });

    // Show loading while session is being fetched
    if (sessionLoading) {
        return (
            <Route path={path}>
                <div>Loading...</div>
            </Route>
        );
    }

    if (!session || session.username !== "root") {
        return (
            <Route path={path}>
                <SharedPasswordLogin />
            </Route>
        );
    }
    return <Route path={path}>{childrenWithProps}</Route>;
};

export const Redirect = ({ to }) => {
    useEffect(() => {
        route(to, true);
    }, [to]);
    return null;
};
