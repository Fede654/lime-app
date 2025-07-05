import api from "utils/uhttpd.service";

import { getNotesPromise, setNotesPromise } from "./notesApi";

jest.mock("utils/uhttpd.service");

describe("notesApi", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getNotesPromise", () => {
        it("calls the correct ubus endpoint", async () => {
            const mockResponse = {
                notes: "Test notes content",
            };

            api.call.mockResolvedValue(mockResponse);

            await getNotesPromise();

            expect(api.call).toHaveBeenCalledWith(
                "lime-utils",
                "get_notes",
                {}
            );
        });

        it("returns notes content from response", async () => {
            const mockNotes = "This is a test note";
            const mockResponse = {
                notes: mockNotes,
            };

            api.call.mockResolvedValue(mockResponse);

            const result = await getNotesPromise();

            expect(result).toBe(mockNotes);
        });

        it("handles empty notes", async () => {
            const mockResponse = {
                notes: "",
            };

            api.call.mockResolvedValue(mockResponse);

            const result = await getNotesPromise();

            expect(result).toBe("");
        });

        it("throws error when notes property is missing", async () => {
            const mockResponse = {};

            api.call.mockResolvedValue(mockResponse);

            await expect(getNotesPromise()).rejects.toThrow("Notes not found");
        });

        it("throws error when notes property is undefined", async () => {
            const mockResponse = {
                notes: undefined,
            };

            api.call.mockResolvedValue(mockResponse);

            await expect(getNotesPromise()).rejects.toThrow("Notes not found");
        });

        it("handles API errors", async () => {
            const error = new Error("Network error");
            api.call.mockRejectedValue(error);

            await expect(getNotesPromise()).rejects.toThrow("Network error");
        });

        it("handles multiline notes", async () => {
            const mockNotes = "Line 1\nLine 2\nLine 3";
            const mockResponse = {
                notes: mockNotes,
            };

            api.call.mockResolvedValue(mockResponse);

            const result = await getNotesPromise();

            expect(result).toBe(mockNotes);
        });
    });

    describe("setNotesPromise", () => {
        it("calls the correct ubus endpoint with notes data", async () => {
            const notes = "New note content";
            const mockResponse = { success: true };

            api.call.mockResolvedValue(mockResponse);

            await setNotesPromise(notes);

            expect(api.call).toHaveBeenCalledWith("lime-utils", "set_notes", {
                notes,
            });
        });

        it("returns response from API", async () => {
            const notes = "Test notes";
            const mockResponse = { success: true, message: "Notes saved" };

            api.call.mockResolvedValue(mockResponse);

            const result = await setNotesPromise(notes);

            expect(result).toEqual(mockResponse);
        });

        it("handles empty notes", async () => {
            const notes = "";
            const mockResponse = { success: true };

            api.call.mockResolvedValue(mockResponse);

            await setNotesPromise(notes);

            expect(api.call).toHaveBeenCalledWith("lime-utils", "set_notes", {
                notes: "",
            });
        });

        it("handles multiline notes", async () => {
            const notes = "Line 1\nLine 2\nLine 3";
            const mockResponse = { success: true };

            api.call.mockResolvedValue(mockResponse);

            await setNotesPromise(notes);

            expect(api.call).toHaveBeenCalledWith("lime-utils", "set_notes", {
                notes,
            });
        });

        it("handles special characters in notes", async () => {
            const notes = "Notes with special chars: àáâãäåæçèéêë ñ 中文 🚀";
            const mockResponse = { success: true };

            api.call.mockResolvedValue(mockResponse);

            await setNotesPromise(notes);

            expect(api.call).toHaveBeenCalledWith("lime-utils", "set_notes", {
                notes,
            });
        });

        it("handles API errors", async () => {
            const notes = "Test notes";
            const error = new Error("Save failed");
            api.call.mockRejectedValue(error);

            await expect(setNotesPromise(notes)).rejects.toThrow("Save failed");
        });
    });
});
