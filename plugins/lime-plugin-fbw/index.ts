import Page from "./src/FbwPage";

export default {
    name: "firstbootwizard/:form",
    page: Page,
    menu: null, // No menu for wizard
    isCommunityProtected: true,
} as LimePlugin;
