import { Trans } from "@lingui/macro";
import { route } from "preact-router";

import { LifeBuoyIcon } from "components/icons/teenny/lifebuoy";

const Menu = () => (
    <span className="flex items-center space-x-2">
        <LifeBuoyIcon className="w-4 h-4 flex-shrink-0" />
        <a
            onClick={() => route("/remotesupport")}
            className="clickable text-lg"
        >
            <Trans>Remote Support</Trans>
        </a>
    </span>
);

export default Menu;
