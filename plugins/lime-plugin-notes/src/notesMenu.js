import { Trans } from "@lingui/macro";
import { route } from "preact-router";

import { DocIcon } from "components/icons/teenny/doc";

export const Menu = () => (
    <span>
        <DocIcon />
        <a onClick={() => route("/notes")} className="clickable">
            <Trans>Notes</Trans>
        </a>
    </span>
);
