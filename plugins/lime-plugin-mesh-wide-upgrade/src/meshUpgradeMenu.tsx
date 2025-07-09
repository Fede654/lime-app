import { Trans } from "@lingui/macro";
import { route } from "preact-router";

import { GlobeAmericasIcon } from "components/icons/teenny/globe";

export const MeshUpgradeMenu = () => (
    <span>
        <GlobeAmericasIcon />
        <a onClick={() => route("/meshwide/upgrade")} className="clickable">
            <Trans>Mesh Wide Upgrade</Trans>
        </a>
    </span>
);
