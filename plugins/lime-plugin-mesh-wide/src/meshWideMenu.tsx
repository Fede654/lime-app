import { Trans } from "@lingui/macro";
import { route } from "preact-router";

import { MapIcon } from "components/icons/teenny/map";

export const MeshWideMenu = () => (
    <span className="flex items-center space-x-2">
        <MapIcon className="w-4 h-4 flex-shrink-0" />
        <a onClick={() => route("/meshwide")} className="clickable text-lg">
            <Trans>Mesh Map</Trans>
        </a>
    </span>
);
