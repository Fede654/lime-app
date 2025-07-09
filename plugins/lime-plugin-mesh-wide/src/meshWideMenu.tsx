import { Trans } from "@lingui/macro";
import { route } from "preact-router";

import { MapIcon } from "components/icons/teenny/map";

export const MeshWideMenu = () => (
    <span>
        <MapIcon />
        <a onClick={() => route("/meshwide")} className="clickable">
            <Trans>Mesh Map</Trans>
        </a>
    </span>
);
