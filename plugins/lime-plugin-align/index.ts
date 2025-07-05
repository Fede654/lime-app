import { AlignMenu } from "./src/alignMenu";
import Page from "./src/alignPage";
import AlignSingle from "./src/containers/alignSingle";

export default {
    name: "Align",
    page: Page,
    menu: AlignMenu,
    additionalRoutes: [["align-single/:iface/:mac", AlignSingle]],
} as LimePlugin;
