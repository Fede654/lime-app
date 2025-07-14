import { Trans } from "@lingui/macro";
import { route } from "preact-router";

import { UpIcon } from "components/icons/teenny/up";

export const Menu = () => (
    <span className="flex items-center space-x-2">
        <UpIcon className="w-4 h-4 flex-shrink-0" />
        <a onClick={() => route("/firmware")} className="clickable text-lg">
            <Trans>Firmware</Trans>
        </a>
    </span>
);
