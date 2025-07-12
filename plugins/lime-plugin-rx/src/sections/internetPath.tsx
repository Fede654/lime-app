import { Trans } from "@lingui/macro";
import { useCallback } from "react";

import { Button } from "components/buttons/button";
import { GlobeIcon } from "components/icons/globeIcon";
import Loading from "components/loading";

import {
    usePath,
    usePathLoss,
} from "plugins/lime-plugin-metrics/src/metricsQueries";
import {
    IconsClassName,
    Section,
    SectionTitle,
} from "plugins/lime-plugin-rx/src/components/components";
import LineChart from "plugins/lime-plugin-rx/src/components/internetPathChart";
import { InternetStatus } from "plugins/lime-plugin-rx/src/components/internetStatus";
import { PathIcon } from "plugins/lime-plugin-rx/src/icons/pathIcon";
import {
    useInternetStatus,
    useNodeStatus,
} from "plugins/lime-plugin-rx/src/rxQueries";
import { IGetInternetStatus } from "plugins/lime-plugin-rx/src/rxTypes";

export const InternetPath = () => {
    const {
        data: path,
        isLoading: pathIsLoading,
        isError: pathError,
    } = usePath({
        refetchOnWindowFocus: false,
        enabled: true,
    });

    const pathLoss =
        path
            ?.filter((station) => station && station.ip) // Filter out invalid stations
            ?.map((station) => {
                return { ip: station.ip };
            })
            .slice()
            .reverse() ?? [];

    const { refetch: refetchLosses } = usePathLoss(pathLoss, {
        refetchOnWindowFocus: false,
        enabled: false,
        initialData: [],
    });

    const { data: internet, isLoading: internetStatusLoading } =
        useInternetStatus({
            structuralSharing: (
                oldData: IGetInternetStatus,
                newData: IGetInternetStatus
            ) => {
                if (
                    // If is the first execution and there are no internet
                    (!oldData &&
                        !(newData.IPv4.working || newData.IPv6.working)) ||
                    // If the old data and new data are different
                    (oldData &&
                        (oldData.IPv4.working || oldData.IPv6.working) !==
                            (newData.IPv4.working || newData.IPv6.working))
                ) {
                    if (refetchLosses) refetchLosses();
                }
                return newData;
            },
        });

    const { data: nodeStatus } = useNodeStatus();

    const checkLosses = useCallback(async () => {
        refetchLosses();
    }, [refetchLosses]);

    const workingInternet =
        !internetStatusLoading &&
        internet &&
        (internet.IPv4?.working || internet.IPv6?.working);

    // Conditional rendering for las known path
    let pathComponent = (
        <div
            className={
                "flex-1 flex flex-column text-center text-xl text-disabled justify-content-center align-items-center mt-5 gap-4"
            }
        >
            <Loading />
            <Trans>
                Loading <br />
                last internet path...
            </Trans>
        </div>
    );
    if (pathError) {
        pathComponent = (
            <div
                className={
                    "flex-1 flex flex-column text-center text-xl text-disabled justify-content-center align-items-center mt-5 gap-4"
                }
            >
                <GlobeIcon
                    size={"36px"}
                    className={"stroke-gray-400 fill-gray-400"}
                />
                <Trans>
                    Error retrieving
                    <br />
                    last internet path
                </Trans>
            </div>
        );
    } else if (!pathIsLoading && path) {
        pathComponent = (
            <span onClick={checkLosses}>
                <LineChart nodes={path} internet={workingInternet} />
            </span>
        );
    }

    return (
        <Section className="">
            <SectionTitle icon={<PathIcon className={IconsClassName} />}>
                <Trans>Path to Internet</Trans>
            </SectionTitle>
            <div className="section-content">
                <div className="responsive-flex">
                    <div className="dashboard-card-gray p-6 flex-1 w-full">{pathComponent}</div>
                    <div className="flex flex-col xl:flex-row gap-4 justify-center items-center xl:flex-shrink-0">
                        <Button
                            href={"/metrics"}
                            color={"secondary"}
                            className="button-enhanced min-w-[140px]"
                        >
                            <Trans>Diagnose</Trans>
                        </Button>
                        <Button
                            href={"/locate"}
                            color={"secondary"}
                            className="button-enhanced min-w-[140px]"
                        >
                            <Trans>Map</Trans>
                        </Button>
                    </div>
                </div>
            </div>
            <InternetStatus data={internet} nodeIps={nodeStatus?.ips} />
        </Section>
    );
};
