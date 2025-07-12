import { Fragment } from "preact";

import { Footer } from "plugins/lime-plugin-rx/src/components/footer";
import { Alignment } from "plugins/lime-plugin-rx/src/sections/alignment";
import { InternetPath } from "plugins/lime-plugin-rx/src/sections/internetPath";
import { System } from "plugins/lime-plugin-rx/src/sections/system";
import { Wired } from "plugins/lime-plugin-rx/src/sections/wired";

const Page = ({}) => {
    return (
        <Fragment>
            {/* Main dashboard container with forced clean layout and full background coverage */}
            <div className="dashboard-height override-legacy-floats force-flex-layout bg-gradient-to-br from-primary-50 via-primary-75 to-primary-100">
                <div className="flex flex-col items-center w-full mx-auto px-2 sm:px-4 lg:px-6 py-6 space-y-8 flex-grow min-w-0">
                    <InternetPath />
                    <Alignment />
                    <Wired />
                    <System />
                    {/* Spacer to ensure footer stays at bottom with full background */}
                    <div className="flex-grow min-h-16"></div>
                </div>
                {/* Footer with consistent spacing and no legacy interference */}
                <div className="w-full mx-auto px-2 sm:px-4 lg:px-6 pb-6 mt-auto override-legacy-floats">
                    <Footer />
                </div>
            </div>
        </Fragment>
    );
};

export default Page;
