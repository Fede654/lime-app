import { Trans } from "@lingui/macro";
import { route } from "preact-router";

import { StatusIcon } from "components/icons/teenny/status";

export const RxMenu = () => (
    <span className="flex items-center space-x-2">
        <StatusIcon className="w-4 h-4 flex-shrink-0" />
        <a onClick={() => route("/rx")} className="clickable text-lg">
            <Trans>Status</Trans>
        </a>
    </span>
);
