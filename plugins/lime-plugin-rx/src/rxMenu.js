import { Trans } from "@lingui/macro";
import { route } from "preact-router";

import { StatusIcon } from "components/icons/teenny/status";

export const RxMenu = () => (
    <span>
        <StatusIcon />
        <a onClick={() => route("/rx")} className="clickable">
            <Trans>Status</Trans>
        </a>
    </span>
);
