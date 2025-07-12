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
        <div className="dashboard-card bg-white-primary-gradient my-6">
            {/* Header */}
            <div className="section-header">
                <h2 className="card-title">
                    <Trans>Internet connection</Trans>
                </h2>
            </div>

            {/* Content */}
            <div className="flex flex-col md:flex-row items-stretch justify-center px-4 py-6 gap-4 min-w-0 overflow-hidden">
                {Object.entries(data).map(([key, value]) => {
                    if (key !== "status") {
                        const protocolIps = getIpsForProtocol(key);
                        const isWorking = value.working;
                        return (
                            <div
                                className={`status-indicator flex-1 ${
                                    isWorking 
                                        ? 'success' 
                                        : isWorking === null 
                                        ? 'loading' 
                                        : 'error'
                                }`}
                                key={key}
                                data-testid={`internet-${key}`}
                            >
                                {/* Status Icon and Protocol Label */}
                                <div className="flex flex-col items-center gap-2">
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
                                    <div className="text-center text-gray-700 text-2xl font-bold tracking-tight">
                                        {key}
                                    </div>
                                    <div className={`status-label ${
                                        isWorking 
                                            ? 'text-green-600' 
                                            : isWorking === null 
                                            ? 'text-gray-500' 
                                            : 'text-red-600'
                                    }`}>
                                        {isWorking ? 'Connected' : isWorking === null ? 'Checking...' : 'Disconnected'}
                                    </div>
                                </div>

                                {/* IP Addresses */}
                                {protocolIps.length > 0 && (
                                    <div className="flex flex-col items-center gap-3 w-full min-w-0">
                                        {protocolIps
                                            .slice(0, 2)
                                            .map((ip, index) => (
                                                <div
                                                    key={index}
                                                    className="font-mono text-xs md:text-sm text-gray-800 bg-white border border-gray-300/60 px-2 md:px-3 py-2 rounded-xl text-center w-full font-semibold break-all shadow-md hover:bg-gray-50 hover:shadow-lg transition-all duration-200 min-w-0 overflow-hidden text-ellipsis"
                                                    title={ip.address}
                                                >
                                                    {ip.address}
                                                </div>
                                            ))}
                                        {protocolIps.length > 2 && (
                                            <div className="text-sm text-gray-500 font-bold tracking-wide">
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
