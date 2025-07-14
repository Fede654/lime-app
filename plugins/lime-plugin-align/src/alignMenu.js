import { Trans } from "@lingui/macro";
import { route } from "preact-router";

import { AlignIcon } from "components/icons/teenny/align";

export const AlignMenu = () => (
    <span className="flex items-center space-x-2">
        <AlignIcon className="w-4 h-4 flex-shrink-0" />
        <a onClick={() => route("/align")} className="clickable text-lg">
            <Trans>Align</Trans>
        </a>
    </span>
);
