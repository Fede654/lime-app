import { Trans } from "@lingui/macro";
import { route } from "preact-router";

import { TicketIcon } from "components/icons/teenny/ticket";

const PiraniaMenu = () => (
    <span>
        <TicketIcon />
        <a onClick={() => route("/access")} className="clickable">
            <Trans>Access Vouchers</Trans>
        </a>
    </span>
);

export default PiraniaMenu;
