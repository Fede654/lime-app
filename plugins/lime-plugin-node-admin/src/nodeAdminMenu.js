import { Trans } from "@lingui/macro";
import { route } from "preact-router";

import { SettingsIcon } from "components/icons/teenny/settings";

const Menu = () => (
    <span>
        <SettingsIcon />
        <a onClick={() => route("/nodeadmin")} className="clickable">
            <Trans>Node Configuration</Trans>
        </a>
    </span>
);

export default Menu;
