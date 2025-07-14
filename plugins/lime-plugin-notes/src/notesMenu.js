import { Trans } from "@lingui/macro";
import { route } from "preact-router";

import { DocIcon } from "components/icons/teenny/doc";

export const Menu = () => (
    <span className="flex items-center space-x-2">
        <DocIcon className="w-4 h-4 flex-shrink-0" />
        <a onClick={() => route("/notes")} className="clickable text-lg">
            <Trans>Notes</Trans>
        </a>
    </span>
);
