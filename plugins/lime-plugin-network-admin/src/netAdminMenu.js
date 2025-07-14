import { Trans } from "@lingui/macro";
import { route } from "preact-router";

import { LockIcon } from "components/icons/teenny/lock";

export const NetAdminMenu = () => (
    <span className="flex items-center space-x-2">
        <LockIcon className="w-4 h-4 flex-shrink-0" />
        <a onClick={() => route("/netadmin")} className="clickable text-lg">
            <Trans>Shared Password</Trans>
        </a>
    </span>
);
