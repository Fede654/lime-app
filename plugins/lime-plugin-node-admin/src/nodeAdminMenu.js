import { Trans } from "@lingui/macro";
import { route } from "preact-router";

import { SettingsIcon } from "components/icons/teenny/settings";

const Menu = () => (
    <span className="flex items-center space-x-2">
        <SettingsIcon className="w-4 h-4 flex-shrink-0" />
        <a onClick={() => route("/nodeadmin")} className="clickable text-lg">
            <Trans>Node Configuration</Trans>
        </a>
    </span>
);

export default Menu;
