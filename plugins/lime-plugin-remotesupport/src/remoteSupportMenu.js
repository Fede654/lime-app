import { Trans } from "@lingui/macro";
import { route } from "preact-router";

import { LifeBuoyIcon } from "components/icons/teenny/lifebuoy";

const Menu = () => (
    <span>
        <LifeBuoyIcon />
        <a onClick={() => route("/remotesupport")} className="clickable">
            <Trans>Remote Support</Trans>
        </a>
    </span>
);

export default Menu;
