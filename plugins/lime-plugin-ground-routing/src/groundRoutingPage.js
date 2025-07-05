import { Trans } from "@lingui/macro";

import { useGroundRouting } from "./groundRoutingQueries";
import "./style.less";

const Page = () => {
    const { data: configuration, isLoading, refetch } = useGroundRouting();

    const preStyle = {
        backgroundColor: "#f5f5f5",
        borderRadius: "4px",
        padding: "15px",
        border: "1px solid #ccc",
    };

    return (
        <div className="container" style={{ paddingTop: "100px" }}>
            <h4>
                <Trans>Ground Routing configuration</Trans>
            </h4>
            <pre style={preStyle}>
                {isLoading
                    ? "Loading..."
                    : JSON.stringify(configuration, null, "  ")}
            </pre>
            <button onClick={() => refetch()} disabled={isLoading}>
                <Trans>Reload</Trans>
            </button>
        </div>
    );
};

export default Page;
