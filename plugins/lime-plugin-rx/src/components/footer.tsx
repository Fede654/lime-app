import { Trans } from "@lingui/macro";

// Import logos directly so webpack can handle the paths correctly
import AlterMundiLogo from "../../../../src/assets/icons/AlterMundiLogo.svg";
import LibreRouterLogo from "../../../../src/assets/icons/LibreRouterLogo.svg";

export const Footer = () => {
    const imgClass = "h-18 image-hover";
    return (
        <div className="w-full bg-primary-white-gradient border-t border-primary-200/60 mt-16 shadow-lg">
            <div className="section-container flex flex-col md:flex-row justify-around items-center gap-10 py-16 responsive-padding">
                {/* AlterMundi Logo */}
                <div className="flex-shrink-0">
                    <img
                        src={AlterMundiLogo}
                        className={imgClass}
                        alt="AlterMundi"
                    />
                </div>
                
                {/* Support Information */}
                <div className="dashboard-card bg-white-primary-gradient card-content-padding flex flex-col text-center space-y-6 max-w-lg">
                    <div className="section-title text-center mb-4">
                        <Trans>Need support?</Trans>
                    </div>
                    <div className="text-lg text-gray-700 leading-relaxed">
                        <Trans>
                            Join{" "}
                            <a
                                className="text-blue-600 hover:text-orange-500 font-bold transition-colors duration-300 underline decoration-2 underline-offset-3 hover:decoration-3"
                                href="https://foro.librerouter.org"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                foro.librerouter.org
                            </a>
                        </Trans>
                    </div>
                    <div className="text-lg text-gray-700 leading-relaxed">
                        <Trans>
                            Visit{" "}
                            <a
                                className="text-orange-500 hover:text-blue-600 font-bold transition-colors duration-300 underline decoration-2 underline-offset-3 hover:decoration-3"
                                href="https://docs.altermundi.net"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                docs.altermundi.net
                            </a>
                        </Trans>
                    </div>
                </div>
                
                {/* LibreRouter Logo */}
                <div className="flex-shrink-0">
                    <img
                        src={LibreRouterLogo}
                        className={imgClass}
                        alt="LibreRouter"
                    />
                </div>
            </div>
        </div>
    );
};
