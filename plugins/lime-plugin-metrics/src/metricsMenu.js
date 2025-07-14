import { Trans } from "@lingui/macro";
import { route } from "preact-router";

import { EqualizerIcon } from "components/icons/teenny/equalizer";

export const MetricsMenu = () => (
    <span className="flex items-center space-x-2">
        <EqualizerIcon className="w-4 h-4 flex-shrink-0" />
        <a onClick={() => route("/metrics")} className="clickable text-lg">
            <Trans>Metrics</Trans>
        </a>
    </span>
);
