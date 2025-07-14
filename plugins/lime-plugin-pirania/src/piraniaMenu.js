import { Trans } from "@lingui/macro";
import { route } from "preact-router";

import { TicketIcon } from "components/icons/teenny/ticket";

const PiraniaMenu = () => (
    <span className="flex items-center space-x-2">
        <TicketIcon className="w-4 h-4 flex-shrink-0" />
        <a onClick={() => route("/access")} className="clickable text-lg">
            <Trans>Access Vouchers</Trans>
        </a>
    </span>
);

export default PiraniaMenu;
