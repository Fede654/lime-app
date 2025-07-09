import { Trans } from "@lingui/macro";
import { route } from "preact-router";

import { AdjustVertical } from "components/icons/teenny/adjust";

export const MeshConfigMenu = () => (
    <span>
        <AdjustVertical />
        <a onClick={() => route("/meshwide/config")} className="clickable">
            <Trans>Mesh Wide Config</Trans>
        </a>
    </span>
);
