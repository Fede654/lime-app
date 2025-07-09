import { Trans } from "@lingui/macro";
import { route } from "preact-router";

import { LockIcon } from "components/icons/teenny/lock";

export const NetAdminMenu = () => (
    <span>
        <LockIcon />
        <a onClick={() => route("/netadmin")} className="clickable">
            <Trans>Shared Password</Trans>
        </a>
    </span>
);
