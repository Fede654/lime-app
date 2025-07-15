import { Trans } from "@lingui/macro";

import {
    IconsClassName,
    Section,
    SectionTitle,
} from "plugins/lime-plugin-rx/src/components/components";
import { PortsIcon } from "plugins/lime-plugin-rx/src/icons/portsIcon";
import { useNodeStatus } from "plugins/lime-plugin-rx/src/rxQueries";
import { SwitchStatus } from "plugins/lime-plugin-rx/src/rxTypes";

const Ports = ({ switches }: { switches: SwitchStatus[] }) => {
    const ports = switches.reduce((acc, obj) => {
        const { role } = obj;
        if (!acc[role]) {
            acc[role] = [];
        }
        acc[role].push(obj);
        return acc;
    }, {});
    return (
        <div
            className={"flex flex-row px-6 gap-8 justify-start py-3"}
            data-testid="ports-container"
        >
            {Object.keys(ports).map((role) => {
                if (role.toLowerCase() === "cpu") return null;
                return (
                    <div
                        key={role}
                        className={`flex flex-col h-fit space-y-2 items-center ${
                            role.toLowerCase() === "lan"
                                ? "bg-primary-50 p-4 rounded-lg border border-primary-200"
                                : "p-2"
                        }`}
                    >
                        <h2
                            className={`font-bold ${
                                role.toLowerCase() === "lan"
                                    ? "text-xl text-primary-dark"
                                    : "text-lg"
                            }`}
                        >
                            {role.toUpperCase()}
                        </h2>
                        <h2
                            className={`text-base ${
                                role.toLowerCase() === "lan"
                                    ? "text-primary-600"
                                    : "text-gray-600"
                            }`}
                        >
                            {ports[role][0]?.device?.toLowerCase() ||
                                "Unknown Device"}
                        </h2>
                        <div
                            className={
                                "flex flex-row gap-4 pt-2 justify-center"
                            }
                        >
                            {ports[role].map((port) => {
                                const link =
                                    port.link?.toLowerCase() === "up"
                                        ? "fill-primary-dark"
                                        : "fill-disabled";
                                return (
                                    <div
                                        key={`${role}-${port.num}`}
                                        className="transform hover:scale-110 transition-transform"
                                    >
                                        <PortsIcon
                                            className={`${
                                                role.toLowerCase() === "lan"
                                                    ? "h-10 w-10"
                                                    : "h-8 w-8"
                                            } ${link}`}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export const Wired = () => {
    const { data: status, isLoading } = useNodeStatus();

    const switches = status?.switch_status;

    return (
        <Section>
            <SectionTitle icon={<PortsIcon className={IconsClassName} />}>
                <Trans>Wired connections</Trans>
            </SectionTitle>
            <div className={"mt-1 mb-2"}>
                {isLoading ? (
                    <div className="flex justify-center py-3">
                        <span>Loading...</span>
                    </div>
                ) : switches?.length ? (
                    <Ports switches={status.switch_status} />
                ) : (
                    <div className={"flex-1 flex justify-center py-3"}>
                        No wired connections found
                    </div>
                )}
            </div>
        </Section>
    );
};
