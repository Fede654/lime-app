import { Trans } from "@lingui/macro";
import { route } from "preact-router";

import { RouterIcon } from "components/icons/teenny/router";

export const ChangeNodeMenu = () => (
    <span>
        <RouterIcon />
        <a onClick={() => route("/changenode")} className="clickable">
            <Trans>Visit a neighboring node</Trans>
        </a>
    </span>
);
