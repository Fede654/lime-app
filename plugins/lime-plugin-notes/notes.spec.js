import "@testing-library/jest-dom";
import { act, fireEvent, screen, waitFor } from "@testing-library/preact";

import {
    getBoardData,
    getChangesNeedReboot,
    getCommunitySettings,
    getSession,
} from "utils/api";
import { DEFAULT_COMMUNITY_SETTINGS } from "utils/constants";
import queryCache from "utils/queryCache";
import { render } from "utils/test_utils";

import { getNotesPromise, setNotesPromise } from "./src/notesApi";
import NotesPage from "./src/notesPage";

jest.mock("./src/notesApi");
jest.mock("utils/api");

const mockNotes =
    "This is a test note for the current node.\nSecond line of the note.";

describe("notes page", () => {
    beforeEach(() => {
        getNotesPromise.mockImplementation(async () => mockNotes);
        setNotesPromise.mockImplementation(async () => ({ success: true }));
        getBoardData.mockImplementation(async () => ({
            hostname: "test-node",
            model: "LibreMesh",
        }));
        getCommunitySettings.mockImplementation(
            async () => DEFAULT_COMMUNITY_SETTINGS
        );
        getChangesNeedReboot.mockImplementation(async () => false);
        getSession.mockImplementation(async () => ({
            username: "root",
        }));
    });

    afterEach(() => {
        act(() => queryCache.clear());
        jest.clearAllMocks();
    });

    it("shows title with hostname", async () => {
        render(<NotesPage />);

        expect(await screen.findByText(/Notes of/i)).toBeInTheDocument();

        expect(await screen.findByText("test-node")).toBeInTheDocument();
    });

    it("loads and displays existing notes in textarea", async () => {
        render(<NotesPage />);

        const textarea = await screen.findByRole("textbox");
        expect(textarea).toBeInTheDocument();

        await waitFor(() => {
            expect(textarea.value).toBe(mockNotes);
        });
    });

    it("allows user to edit notes", async () => {
        render(<NotesPage />);

        const textarea = await screen.findByRole("textbox");
        await waitFor(() => {
            expect(textarea.value).toBe(mockNotes);
        });

        const newText = "Updated note content";
        fireEvent.change(textarea, { target: { value: newText } });

        expect(textarea.value).toBe(newText);
    });

    it("saves notes when save button is clicked", async () => {
        render(<NotesPage />);

        const textarea = await screen.findByRole("textbox");
        const saveButton = await screen.findByRole("button", {
            name: /save notes/i,
        });

        await waitFor(() => {
            expect(textarea.value).toBe(mockNotes);
        });

        const newText = "New note content";
        fireEvent.change(textarea, { target: { value: newText } });
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(setNotesPromise).toHaveBeenCalledWith(newText);
        });
    });

    it("disables save button during loading", async () => {
        // Mock loading state for get notes
        getNotesPromise.mockImplementation(() => new Promise(() => {})); // Never resolves

        render(<NotesPage />);

        const saveButton = await screen.findByRole("button", {
            name: /save notes/i,
        });
        expect(saveButton).toBeDisabled();
    });

    it("disables save button during save operation", async () => {
        // Mock slow save operation
        setNotesPromise.mockImplementation(
            () =>
                new Promise((resolve) =>
                    setTimeout(() => resolve({ success: true }), 1000)
                )
        );

        render(<NotesPage />);

        const textarea = await screen.findByRole("textbox");
        const saveButton = await screen.findByRole("button", {
            name: /save notes/i,
        });

        await waitFor(() => {
            expect(textarea.value).toBe(mockNotes);
        });

        fireEvent.change(textarea, { target: { value: "New content" } });
        fireEvent.click(saveButton);

        // Button should be disabled during save
        expect(saveButton).toBeDisabled();
    });

    it("handles empty notes", async () => {
        getNotesPromise.mockImplementation(async () => "");

        render(<NotesPage />);

        const textarea = await screen.findByRole("textbox");
        await waitFor(() => {
            expect(textarea.value).toBe("");
        });
    });

    it("handles API errors gracefully", async () => {
        getNotesPromise.mockRejectedValue(new Error("API Error"));

        render(<NotesPage />);

        // Should still render the basic UI structure
        expect(await screen.findByText(/Notes of/i)).toBeInTheDocument();

        const textarea = await screen.findByRole("textbox");
        expect(textarea).toBeInTheDocument();
    });

    it("handles save errors gracefully", async () => {
        setNotesPromise.mockRejectedValue(new Error("Save failed"));

        render(<NotesPage />);

        const textarea = await screen.findByRole("textbox");
        const saveButton = await screen.findByRole("button", {
            name: /save notes/i,
        });

        await waitFor(() => {
            expect(textarea.value).toBe(mockNotes);
        });

        fireEvent.change(textarea, { target: { value: "New content" } });
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(setNotesPromise).toHaveBeenCalled();
        });

        // Button should be enabled again after error
        await waitFor(() => {
            expect(saveButton).not.toBeDisabled();
        });
    });

    it("updates textarea when notes data changes", async () => {
        render(<NotesPage />);

        const textarea = await screen.findByRole("textbox");
        await waitFor(() => {
            expect(textarea.value).toBe(mockNotes);
        });

        // Simulate external notes update
        const newNotes = "Externally updated notes";
        getNotesPromise.mockImplementation(async () => newNotes);

        // Trigger a refetch by invalidating the cache
        act(() => {
            queryCache.invalidateQueries(["lime-utils", "get_notes"]);
        });

        await waitFor(() => {
            expect(textarea.value).toBe(newNotes);
        });
    });
});
