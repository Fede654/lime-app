import { Menu } from "./src/firmwareMenu";
import FirmwarePage from "./src/firmwarePage";
import { UpgradeAvailabeInfo } from "./src/upgradeAvailable";

export default {
    name: "firmware",
    page: FirmwarePage,
    menu: Menu,
    isCommunityProtected: true,
    additionalRoutes: [
        ["releaseInfo", UpgradeAvailabeInfo],
        ["firmware-alt", FirmwarePage],
    ],
} as LimePlugin;

export { SafeUpgradeCountdown } from "./src/upgradeCountdown";
export { UpgradeAvailableBanner } from "./src/upgradeAvailable";
