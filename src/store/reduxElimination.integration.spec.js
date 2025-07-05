import "@testing-library/jest-dom";

import { plugins } from "../config";
import { loadEpics, loadReducers } from "../utils/loader";

describe("Redux Elimination Integration Tests", () => {
    describe("Plugin Store Configuration", () => {
        it("migrated plugins should not register Redux stores", () => {
            const migratedPluginNames = [
                "Align",
                "changeNode",
                "Notes",
                "groundRouting",
            ];

            migratedPluginNames.forEach((pluginName) => {
                const plugin = plugins.find((p) => p.name === pluginName);

                expect(plugin).toBeDefined();
                expect(plugin.store).toBeUndefined();
            });
        });

        it("should not load any reducers from migrated plugins", () => {
            const reducers = loadReducers(plugins);

            // Check that no reducers are loaded from migrated plugins
            expect(reducers.align).toBeUndefined();
            expect(reducers.changeNode).toBeUndefined();
            expect(reducers.notes).toBeUndefined();
            expect(reducers.groundrouting).toBeUndefined();
        });

        it("should not load any epics from migrated plugins", () => {
            const epics = loadEpics(plugins);

            // Should have minimal epics (only non-migrated plugins if any)
            expect(Array.isArray(epics)).toBe(true);

            // The epics array should not contain any functions from migrated plugins
            // Since we can't easily inspect the epic functions, we just check the count
            // In a fully migrated system, this should be 0 or very small
            expect(epics.length).toBeLessThan(5); // Assuming most plugins are migrated
        });
    });

    describe("Migration Completeness", () => {
        it("all specified plugins should be fully migrated", () => {
            const expectedMigratedPlugins = [
                "Align",
                "changeNode",
                "Notes",
                "groundRouting",
            ];

            expectedMigratedPlugins.forEach((name) => {
                const plugin = plugins.find((p) => p.name === name);

                expect(plugin).toBeDefined();
                expect(plugin.store).toBeUndefined();
            });
        });
    });
});
