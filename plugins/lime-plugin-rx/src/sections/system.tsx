import { Trans, plural, t } from "@lingui/macro";
import { Fragment } from "preact";

import {
    IconsClassName,
    LoadingCard,
    Section,
    SectionTitle,
} from "plugins/lime-plugin-rx/src/components/components";
import { GearIcon } from "plugins/lime-plugin-rx/src/icons/gearIcon";
import { useNodeStatus } from "plugins/lime-plugin-rx/src/rxQueries";

import { useBoardData } from "utils/queries";
import { IGetBoardDataResponse } from "utils/types";

const toHHMMSS = (seconds: string, plus: number) => {
    const secNum = parseInt(seconds, 10) + plus;
    const days = Math.floor(secNum / 86400);
    const hours = Math.floor(secNum / 3600) % 24;
    const mins = Math.floor(secNum / 60) % 60;
    const secs = secNum % 60;
    const daysText = days
        ? plural(days, { one: "# day", other: "# days" })
        : null;
    const hoursText = hours
        ? plural(hours, { one: "# hour", other: "# hours" })
        : null;
    const minsText = mins
        ? plural(mins, { one: "# minute", other: "# minutes" })
        : null;
    const secsText = secs
        ? plural(secs, { one: "# second", other: "# seconds" })
        : null;
    const allTexts = [daysText, hoursText, minsText, secsText];
    return allTexts.filter((x) => x !== null).join(", ");
};

const SystemInfo = () => {
    const { data: node } = useNodeStatus();
    const { data: bd } = useBoardData();

    const boardData = bd as IGetBoardDataResponse;

    const systemAttributes = [
        {
            label: t`Uptime`,
            value: toHHMMSS(node?.uptime, 0),
            icon: "⏱️",
        },
        { 
            label: t`Device`, 
            value: boardData?.board_name || "Unknown",
            icon: "📱",
        },
        { 
            label: t`Firmware`, 
            value: boardData?.release?.description || "Unknown",
            icon: "💾",
        },
    ];

    return (
        <div className="section-content">
            <div className="responsive-grid">
                {systemAttributes.map((attribute, i) => (
                    <div
                        key={i}
                        className="dashboard-card-primary-lift card-content-padding"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <span className="text-3xl icon-enhanced">{attribute.icon}</span>
                            <div className="card-title text-xl">
                                {attribute.label}
                            </div>
                        </div>
                        <div className="text-lg text-gray-800 break-words font-semibold leading-relaxed">
                            {attribute.value || "N/A"}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const System = () => {
    const { isLoading: isLoadingNodeStatus } = useNodeStatus();
    const { isLoading: isLoadingBoardData } = useBoardData();

    const isLoading = isLoadingBoardData || isLoadingNodeStatus;

    return (
        <Section className="">
            <SectionTitle icon={<GearIcon className={IconsClassName} />}>
                <Trans>System</Trans>
            </SectionTitle>
            <div className="pb-4">
                {isLoading ? (
                    <LoadingCard message="Loading system information..." />
                ) : (
                    <SystemInfo />
                )}
            </div>
        </Section>
    );
};
