import { Fragment } from "preact";

import { Footer } from "plugins/lime-plugin-rx/src/components/footer";
import { Alignment } from "plugins/lime-plugin-rx/src/sections/alignment";
import { InternetPath } from "plugins/lime-plugin-rx/src/sections/internetPath";
import { System } from "plugins/lime-plugin-rx/src/sections/system";
import { Wired } from "plugins/lime-plugin-rx/src/sections/wired";

const Page = ({}) => {
    return (
        <Fragment>
            <div
                className={
                    "flex flex-col items-center w-full max-w-screen-md mx-auto space-y-4 pt-4 pb-6"
                }
            >
                <InternetPath />
                <Alignment />
                <Wired />
                <System />
                <Footer />
            </div>
        </Fragment>
    );
};

export default Page;
