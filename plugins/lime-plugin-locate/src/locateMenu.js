import { Trans } from "@lingui/macro";
import { route } from "preact-router";

import { PinIcon } from "components/icons/teenny/pin";

export const LocateMenu = () => (
    <span className="flex items-center space-x-2">
        <PinIcon className="w-4 h-4 flex-shrink-0" />
        <a onClick={() => route("/locate")} className="clickable text-lg">
            <Trans>Locate</Trans>
        </a>
    </span>
);
