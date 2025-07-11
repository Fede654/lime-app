import { Trans } from "@lingui/macro";

// Import logos directly so webpack can handle the paths correctly
import AlterMundiLogo from "assets/icons/AlterMundiLogo.svg";
import LibreRouterLogo from "assets/icons/LibreRouterLogo.svg";

export const Footer = () => {
    const imgClass = "h-16";
    return (
        <div
            className={
                "w-full flex justify-around content-center items-center py-8 bg-gray-50 border-t border-gray-200 mt-8"
            }
        >
            <div>
                <img
                    src={AlterMundiLogo}
                    className={imgClass}
                    alt="AlterMundi"
                />
            </div>
            <div className={"flex flex-col text-center text-xl"}>
                <div className={"italic font-normal text-2xl"}>
                    <Trans>Need support?</Trans>
                </div>
                <div>
                    <Trans>
                        Join{" "}
                        <a
                            className={"text-[#0198FE] hover:text-[#F39100]"}
                            href={"https://foro.librerouter.org"}
                        >
                            foro.librerouter.org
                        </a>
                    </Trans>
                </div>
                <div>
                    <Trans>
                        Visit{" "}
                        <a
                            className={"text-[#F39100] hover:text-[#0198FE]"}
                            href={"https://docs.altermundi.net"}
                        >
                            docs.altermundi.net
                        </a>
                    </Trans>
                </div>
            </div>
            <div>
                <img
                    src={LibreRouterLogo}
                    className={imgClass}
                    alt="LibreRouter"
                />
            </div>
        </div>
    );
};
