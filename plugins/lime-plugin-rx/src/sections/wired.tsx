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
            className={"flex flex-wrap px-10 gap-8 justify-center"}
            data-testid="ports-container"
        >
            {Object.keys(ports).map((role) => {
                if (role.toLowerCase() === "cpu") return null;
                return (
                    <div
                        key={role}
                        className={
                            "flex flex-col h-fit bg-gray-50 p-6 rounded-lg border border-gray-200 min-w-[150px]"
                        }
                    >
                        <h2 className={"font-bold text-xl text-center mb-2"}>
                            {role.toUpperCase()}
                        </h2>
                        <h2
                            className={"text-lg text-center mb-4 text-gray-600"}
                        >
                            {ports[role][0]?.device?.toLowerCase() ||
                                "Unknown Device"}
                        </h2>
                        <div className={"flex flex-row gap-3 justify-center"}>
                            {ports[role].map((port) => {
                                const link =
                                    port.link?.toLowerCase() === "up"
                                        ? "fill-primary-dark"
                                        : "fill-disabled";
                                return (
                                    <div key={`${role}-${port.num}`}>
                                        <PortsIcon
                                            className={`h-10 w-10 ${link}`}
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
            <div className={"mt-4"}>
                {isLoading ? (
                    <span className="text-xl px-6">Loading...</span>
                ) : switches.length ? (
                    <Ports switches={status.switch_status} />
                ) : (
                    <div className={"flex-1 flex justify-center"}>
                        No wired connections found
                    </div>
                )}
            </div>
        </Section>
    );
};
