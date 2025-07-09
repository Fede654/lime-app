import { Trans } from "@lingui/macro";
import { route } from "preact-router";

import { UpIcon } from "components/icons/teenny/up";

export const Menu = () => (
    <span>
        <UpIcon />
        <a onClick={() => route("/firmware")} className="clickable">
            <Trans>Firmware</Trans>
        </a>
    </span>
);
