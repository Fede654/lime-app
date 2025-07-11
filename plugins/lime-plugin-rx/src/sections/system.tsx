import { Trans, plural, t } from "@lingui/macro";
import { Fragment } from "preact";

import {
    IconsClassName,
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
        },
        { label: t`Device`, value: boardData.board_name },
        { label: t`Firmware`, value: boardData.release.description },
    ];

    return (
        <div className="flex justify-start px-10 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                {systemAttributes.map((attribute, i) => (
                    <div
                        key={i}
                        className="flex flex-col space-y-3 bg-gray-50 p-6 rounded-lg border border-gray-200"
                    >
                        <div className="text-xl font-semibold text-gray-700">
                            {attribute.label}
                        </div>
                        <div className="text-2xl text-gray-900 break-words font-medium">
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
        <Section>
            <SectionTitle icon={<GearIcon className={IconsClassName} />}>
                <Trans>System</Trans>
            </SectionTitle>
            <div className={"mt-2"}>
                {isLoading ? (
                    <span className="px-6 text-xl">Loading...</span>
                ) : (
                    <SystemInfo />
                )}
            </div>
        </Section>
    );
};
