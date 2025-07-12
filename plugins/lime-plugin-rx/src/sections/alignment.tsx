import { Trans } from "@lingui/macro";
import { Fragment } from "preact";

import { Button } from "components/buttons/button";

import {
    IconsClassName,
    LoadingCard,
    Section,
    SectionTitle,
} from "plugins/lime-plugin-rx/src/components/components";
import { SignalColor } from "plugins/lime-plugin-rx/src/components/signalColor";
import { AlignIcon } from "plugins/lime-plugin-rx/src/icons/alignIcon";
import { useNodeStatus } from "plugins/lime-plugin-rx/src/rxQueries";
import { StatusResponse } from "plugins/lime-plugin-rx/src/rxTypes";

import { useBatHost } from "utils/queries";

function stripIface(hostIface) {
    return hostIface.split("_wlan")[0].replace("_", "-");
}

export const AlignmentCard = ({ status }: { status: StatusResponse }) => {
    // Handle null/undefined status
    if (!status) {
        return null;
    }

    const hasMostActive = !!status.most_active?.iface;
    // Validate MAC address format (XX:XX:XX:XX:XX:XX)
    const hasValidMac =
        status.most_active?.station_mac &&
        /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(
            status.most_active.station_mac
        );

    const { data: bathost } = useBatHost(
        status.most_active && status.most_active.station_mac,
        status.most_active && status.most_active.iface,
        { enabled: hasMostActive && hasValidMac }
    );

    const traffic = Math.round(
        ((status.most_active?.rx_bytes || 0) + (status.most_active?.tx_bytes || 0)) /
            1024 /
            1024
    );
    return (
        <div className="section-content">
            {hasMostActive && (
                <Fragment>
                    <div className="responsive-flex">
                        {/* Signal strength display */}
                        <div className="dashboard-card-primary card-content-padding flex flex-col items-center text-center w-full xl:w-auto xl:min-w-[220px] xl:flex-shrink-0">
                            <div className="text-7xl lg:text-8xl text-primary-600 font-black mb-3 icon-enhanced">
                                <SignalColor
                                    className="font-black"
                                    signal={+status.most_active.signal}
                                />
                            </div>
                            <div className="text-2xl lg:text-3xl text-primary-500 font-bold">
                                {status.most_active?.chains &&
                                    Array.isArray(status.most_active.chains) &&
                                    status.most_active.chains.map((chain, i) => (
                                        <span key={i}>
                                            <SignalColor
                                                className="font-bold"
                                                signal={chain}
                                            />
                                            {i !==
                                                (status.most_active.chains?.length || 0) -
                                                    1 && " / "}
                                        </span>
                                    ))}
                            </div>
                            <div className="text-sm text-primary-400 font-medium mt-2 tracking-wide uppercase">
                                <Trans>Signal Strength</Trans>
                            </div>
                        </div>
                        
                        {/* Connection details */}
                        <div className="dashboard-card-gray card-content-padding flex-1 flex flex-col gap-4 text-lg lg:text-xl text-center lg:text-left">
                            <div className="card-title text-center lg:text-left mb-2">
                                <Trans>Most active link</Trans>
                            </div>
                            <div className="text-primary-600 font-bold text-xl">
                                {bathost && bathost.hostname ? (
                                    <span>{stripIface(bathost.hostname)}</span>
                                ) : (
                                    <span className="withLoadingEllipsis text-primary-400">
                                        <Trans>Fetching name</Trans>
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="text-gray-700 text-lg">
                                    <span className="text-gray-500 font-medium">
                                        <Trans>Interface: </Trans>
                                    </span>
                                    <span className="font-bold text-primary-600">
                                        {status.most_active.iface}
                                    </span>
                                </div>
                                <div className="text-gray-700 text-lg">
                                    <span className="text-gray-500 font-medium">
                                        <Trans>Traffic: </Trans>
                                    </span>
                                    <span className="font-bold text-primary-600">{traffic}MB/s</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Action button */}
                        <div className="flex justify-center items-center xl:flex-shrink-0">
                            <Button size="lg" color="secondary" href="/align" className="button-enhanced px-10">
                                <Trans>
                                    Check
                                    <br />
                                    Alignment
                                </Trans>
                            </Button>
                        </div>
                    </div>
                </Fragment>
            )}
            {!hasMostActive && (
                <div className="dashboard-card-gray card-content-padding flex-1 flex justify-center items-center py-16 text-gray-500 text-xl">
                    <Trans>No most active interface detected</Trans>
                </div>
            )}
        </div>
    );
};

export const Alignment = () => {
    const { data: status, isLoading } = useNodeStatus();

    return (
        <Section className="">
            <SectionTitle icon={<AlignIcon className={IconsClassName} />}>
                <Trans>Your Alignment</Trans>
            </SectionTitle>
            {isLoading ? (
                <LoadingCard message="Loading alignment data..." />
            ) : (
                <AlignmentCard status={status} />
            )}
        </Section>
    );
};
