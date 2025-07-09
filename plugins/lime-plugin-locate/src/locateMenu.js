import { Trans } from "@lingui/macro";
import { route } from "preact-router";

import { PinIcon } from "components/icons/teenny/pin";

export const LocateMenu = () => (
    <span>
        <PinIcon />
        <a onClick={() => route("/locate")} className="clickable">
            <Trans>Locate</Trans>
        </a>
    </span>
);
