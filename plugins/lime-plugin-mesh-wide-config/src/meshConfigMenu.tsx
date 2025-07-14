import { Trans } from "@lingui/macro";
import { route } from "preact-router";

import { AdjustVertical } from "components/icons/teenny/adjust";

export const MeshConfigMenu = () => (
    <span className="flex items-center space-x-2">
        <AdjustVertical className="w-4 h-4 flex-shrink-0" />
        <a onClick={() => route("/meshwide/config")} className="clickable text-lg">
            <Trans>Mesh Wide Config</Trans>
        </a>
    </span>
);
