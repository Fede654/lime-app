import { Trans } from "@lingui/macro";
import { route } from "preact-router";

import { EqualizerIcon } from "components/icons/teenny/equalizer";

export const MetricsMenu = () => (
    <span>
        <EqualizerIcon />
        <a onClick={() => route("/metrics")} className="clickable">
            <Trans>Metrics</Trans>
        </a>
    </span>
);
