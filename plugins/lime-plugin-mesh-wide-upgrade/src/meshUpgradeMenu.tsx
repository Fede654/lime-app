import { Trans } from "@lingui/macro";
import { route } from "preact-router";

import { GlobeAmericasIcon } from "components/icons/teenny/globe";

export const MeshUpgradeMenu = () => (
    <span className="flex items-center space-x-2">
        <GlobeAmericasIcon className="w-4 h-4 flex-shrink-0" />
        <a
            onClick={() => route("/meshwide/upgrade")}
            className="clickable text-lg"
        >
            <Trans>Mesh Wide Upgrade</Trans>
        </a>
    </span>
);
