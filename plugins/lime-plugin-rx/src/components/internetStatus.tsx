import { Trans } from "@lingui/macro";

import { Circle } from "components/icons/circle";
import { CirclecheckIcon } from "components/icons/circlecheckIcon";
import { XmarkIcon } from "components/icons/xmarkIcon";

import { IGetInternetStatus } from "plugins/lime-plugin-rx/src/rxTypes";

interface DeviceStatus {
    version: string;
    address: string;
}

export const InternetStatus = ({
    data,
    nodeIps,
}: {
    data: IGetInternetStatus;
    nodeIps?: DeviceStatus[];
}) => {
    const checkIconClass = "h-10 w-10 fill-primary-600 ";
    const xmarkIconClass = "h-10 w-10 fill-danger ";
    const loadiIconClass = "h-10 w-10 stroke-disabled";

    // Process IP addresses
    const ipv4Addresses = nodeIps?.filter((ip) => ip.version === "4") || [];
    const ipv6Addresses = nodeIps?.filter((ip) => ip.version === "6") || [];

    // Helper to get relevant IPs for each protocol
    const getIpsForProtocol = (protocol: string) => {
        if (protocol === "IPv4") return ipv4Addresses;
        if (protocol === "IPv6") return ipv6Addresses;
        return [];
    };

    // Handle null/undefined data
    if (!data) {
        return (
            <div className="w-full flex items-center flex-row p-3 gap-4">
                <h2 className="text-end flex-1 text-base">
                    <Trans>
                        Internet
                        <br />
                        connection
                    </Trans>
                </h2>
                <div className="flex justify-center items-center flex-1 gap-2">
                    <Circle
                        className={loadiIconClass}
                        dataTestId="internet-status-loading"
                    />
                    <div className="text-center text-disabled text-xl">
                        <Trans>Loading...</Trans>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-gray-50 rounded-lg mx-6 mr-8">
            {/* Título independiente */}
            <div className="px-6 pt-4 pb-2">
                <h2 className="text-2xl font-semibold text-gray-800">
                    <Trans>Internet connection</Trans>
                </h2>
            </div>

            {/* Contenido con columnas */}
            <div className="flex items-start flex-row px-6 pb-6 gap-3">
                {Object.entries(data).map(([key, value]) => {
                    if (key !== "status") {
                        const protocolIps = getIpsForProtocol(key);
                        return (
                            <div
                                className="flex flex-col items-center flex-1 gap-2 min-w-[240px]"
                                key={key}
                                data-testid={`internet-${key}`}
                            >
                                {/* Status Icon and Protocol Label */}
                                <div className="flex flex-col items-center gap-1">
                                    {value.working === null ? (
                                        <Circle
                                            className={loadiIconClass}
                                            dataTestId={`internet-status-${key}`}
                                        />
                                    ) : value.working ? (
                                        <CirclecheckIcon
                                            className={checkIconClass}
                                            dataTestId={`internet-status-${key}`}
                                        />
                                    ) : (
                                        <XmarkIcon
                                            className={xmarkIconClass}
                                            dataTestId={`internet-status-${key}`}
                                        />
                                    )}
                                    <div className="text-center text-disabled text-xl font-semibold">
                                        {key}
                                    </div>
                                </div>

                                {/* IP Addresses */}
                                {protocolIps.length > 0 && (
                                    <div className="flex flex-col items-center gap-2 w-full">
                                        {protocolIps
                                            .slice(0, 2)
                                            .map((ip, index) => (
                                                <div
                                                    key={index}
                                                    className="font-mono text-lg text-gray-800 bg-white border border-gray-300 px-4 py-3 rounded-lg text-center w-full font-medium break-all shadow-sm"
                                                    title={ip.address}
                                                >
                                                    {ip.address}
                                                </div>
                                            ))}
                                        {protocolIps.length > 2 && (
                                            <div className="text-base text-gray-500 font-medium">
                                                +{protocolIps.length - 2} more
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    }
                })}
            </div>
        </div>
    );
};
