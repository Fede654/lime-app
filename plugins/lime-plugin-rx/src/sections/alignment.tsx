import { Trans } from "@lingui/macro";
import { Fragment } from "preact";

import { Button } from "components/buttons/button";

import {
    IconsClassName,
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
        <div className={"flex flex-row mt-6 justify-between gap-8 px-10"}>
            {hasMostActive && (
                <Fragment>
                    <div className={"flex-1 text-7xl text-center text-primary"}>
                        <SignalColor
                            className={"font-bold"}
                            signal={+status.most_active.signal}
                        />
                        <div className={"text-3xl"}>
                            {status.most_active?.chains &&
                                Array.isArray(status.most_active.chains) &&
                                status.most_active.chains.map((chain, i) => (
                                    <span key={i}>
                                        <SignalColor
                                            className={"font-bold"}
                                            signal={chain}
                                        />
                                        {i !==
                                            (status.most_active.chains?.length || 0) -
                                                1 && " / "}
                                    </span>
                                ))}
                        </div>
                    </div>
                    <div className={"flex-1 flex flex-col text-2xl "}>
                        <div className={"font-bold"}>
                            <Trans>Most active link</Trans>
                        </div>
                        <div className={"text-primary font-bold"}>
                            {bathost && bathost.hostname ? (
                                <span>{stripIface(bathost.hostname)}</span>
                            ) : (
                                <span className="withLoadingEllipsis">
                                    <Trans>Fetching name</Trans>
                                </span>
                            )}
                        </div>
                        <div>
                            <Trans>Interface: </Trans>
                            <span className={"font-bold"}>
                                {status.most_active.iface}
                            </span>
                        </div>
                        <div>
                            <Trans>Traffic: </Trans>
                            <span className={"font-bold"}> {traffic}MB/s</span>
                        </div>
                    </div>
                </Fragment>
            )}
            {!hasMostActive && (
                <div className={"flex-1 flex justify-center"}>
                    No most active iface
                </div>
            )}
            <div className={"flex justify-center"}>
                <Button size={"lg"} color={"secondary"} href={"/align"}>
                    <Trans>
                        Check
                        <br />
                        Alignment
                    </Trans>
                </Button>
            </div>
        </div>
    );
};

export const Alignment = () => {
    const { data: status, isLoading } = useNodeStatus();

    return (
        <div
            className={
                "w-full min-h-min bg-primary-card border-b-2 border-primary-600 pb-10 pr-2"
            }
        >
            <Section>
                <SectionTitle icon={<AlignIcon className={IconsClassName} />}>
                    <Trans>Your Alignment</Trans>
                </SectionTitle>
                {isLoading ? (
                    <div className={"flex-1 flex justify-center text-xl px-6"}>
                        Loading...
                    </div>
                ) : (
                    <AlignmentCard status={status} />
                )}
            </Section>
        </div>
    );
};
