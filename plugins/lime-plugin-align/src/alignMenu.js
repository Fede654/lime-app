import { Trans } from "@lingui/macro";
import { route } from "preact-router";

import { AlignIcon } from "components/icons/teenny/align";

export const AlignMenu = () => (
    <span>
        <AlignIcon />
        <a onClick={() => route("/align")} className="clickable">
            <Trans>Align</Trans>
        </a>
    </span>
);
