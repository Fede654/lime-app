import { Trans } from "@lingui/macro";
import { route } from "preact-router";

export const Menu = () => (
    <a onClick={() => route("/groundrouting")} className="clickable">
        <Trans>Ground Routing</Trans>
    </a>
);
