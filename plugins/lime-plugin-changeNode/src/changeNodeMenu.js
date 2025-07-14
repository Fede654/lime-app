import { Trans } from "@lingui/macro";
import { route } from "preact-router";

import { RouterIcon } from "components/icons/teenny/router";

export const ChangeNodeMenu = () => (
    <span className="flex items-center space-x-2">
        <RouterIcon className="w-4 h-4 flex-shrink-0" />
        <a onClick={() => route("/changenode")} className="clickable text-lg">
            <Trans>Visit a neighboring node</Trans>
        </a>
    </span>
);
