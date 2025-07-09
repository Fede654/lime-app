import Page from "./src/FbwPage";

export default {
    name: "firstbootwizard/:form",
    page: Page,
    menu: null, // No menu for wizard
    isCommunityProtected: false, // Allow access before authentication for initial setup
} as LimePlugin;
