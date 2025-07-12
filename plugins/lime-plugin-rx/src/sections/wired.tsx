import { Trans } from "@lingui/macro";

import {
    IconsClassName,
    LoadingCard,
    Section,
    SectionTitle,
} from "plugins/lime-plugin-rx/src/components/components";
import { PortsIcon } from "plugins/lime-plugin-rx/src/icons/portsIcon";
import { useNodeStatus } from "plugins/lime-plugin-rx/src/rxQueries";
import { SwitchStatus } from "plugins/lime-plugin-rx/src/rxTypes";

const Ports = ({ switches }: { switches: SwitchStatus[] }) => {
    const ports = switches
        .filter((obj) => obj && obj.role) // Filter out invalid objects
        .reduce((acc, obj) => {
            const { role } = obj;
            if (!acc[role]) {
                acc[role] = [];
            }
            acc[role].push(obj);
            return acc;
        }, {});
    return (
        <div className="section-content">
            <div className="responsive-grid-dense" data-testid="ports-container">
                {Object.keys(ports).map((role) => {
                    if (role.toLowerCase() === "cpu") return null;
                    return (
                        <div
                            key={role}
                            className="dashboard-card-gray card-content-padding transform hover:-translate-y-1 min-w-[200px]"
                        >
                            <h2 className="card-title text-center mb-3">
                                {role.toUpperCase()}
                            </h2>
                            <h3 className="text-lg text-center mb-6 text-gray-600 font-semibold">
                                {ports[role][0]?.device?.toLowerCase() || "Unknown Device"}
                            </h3>
                            <div className="flex flex-row gap-4 justify-center items-center">
                                {ports[role].map((port, index) => {
                                    const link =
                                        port?.link?.toLowerCase() === "up"
                                            ? "fill-primary-600"
                                            : "fill-gray-400";
                                    const statusText = port?.link?.toLowerCase() === "up" ? "Connected" : "Disconnected";
                                    return (
                                        <div key={`${role}-${port?.num || index}`} className="flex flex-col items-center gap-2">
                                            <PortsIcon className={`h-14 w-14 ${link} transition-colors duration-200 icon-enhanced`} />
                                            <span className={`text-sm font-bold ${
                                                port?.link?.toLowerCase() === "up" ? "text-primary-600" : "text-gray-400"
                                            }`}>
                                                Port {port?.num || index + 1}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export const Wired = () => {
    const { data: status, isLoading } = useNodeStatus();

    const switches = status?.switch_status || [];

    return (
        <Section className="">
            <SectionTitle icon={<PortsIcon className={IconsClassName} />}>
                <Trans>Wired connections</Trans>
            </SectionTitle>
            {isLoading ? (
                <LoadingCard message="Loading wired connections..." />
            ) : switches.length ? (
                <Ports switches={switches} />
            ) : (
                <div className="flex justify-center items-center py-16 responsive-padding">
                    <div className="text-xl text-gray-500 dashboard-card-gray card-content-padding">
                        <Trans>No wired connections found</Trans>
                    </div>
                </div>
            )}
        </Section>
    );
};
