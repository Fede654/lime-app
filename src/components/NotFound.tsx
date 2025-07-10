import { Trans } from "@lingui/macro";
import { route } from "preact-router";

import { Button } from "components/buttons/button";

export const NotFound = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary-lighter to-gray-50 px-4">
        <div className="text-center max-w-lg mx-auto">
            {/* Visual 404 with better styling */}
            <div className="mb-8">
                <div className="text-8xl md:text-9xl font-black text-primary opacity-20 mb-4">
                    404
                </div>
                <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-6" />
            </div>

            {/* Content section */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                    <Trans>Page Not Found</Trans>
                </h1>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    <Trans>
                        The page you're looking for doesn't exist or has been
                        moved. Let's get you back to exploring your LibreMesh
                        network.
                    </Trans>
                </p>

                {/* Action buttons with improved spacing */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        onClick={() => route("/")}
                        color="primary"
                        size="lg"
                        className="min-w-[120px] font-semibold"
                    >
                        <Trans>Go Home</Trans>
                    </Button>
                    <Button
                        onClick={() =>
                            typeof window !== "undefined" &&
                            window.history.back()
                        }
                        color="secondary"
                        size="lg"
                        className="min-w-[120px] font-semibold"
                    >
                        <Trans>Go Back</Trans>
                    </Button>
                </div>
            </div>

            {/* Helper text */}
            <p className="text-sm text-gray-500">
                <Trans>
                    Need help? Check the network status or contact your network
                    administrator.
                </Trans>
            </p>
        </div>
    </div>
);
