import { QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/preact";

import queryCache from "utils/queryCache";

import { getNotesPromise, setNotesPromise } from "./notesApi";
import { useNotes, useSetNotes } from "./notesQueries";

jest.mock("./notesApi");

describe("notesQueries", () => {
    const wrapper = ({ children }) => (
        <QueryClientProvider client={queryCache}>
            {children}
        </QueryClientProvider>
    );

    beforeEach(() => {
        act(() => queryCache.clear());
        jest.clearAllMocks();
    });

    describe("useNotes", () => {
        it("calls getNotesPromise and returns data", async () => {
            const mockNotes = "Test notes content";
            getNotesPromise.mockResolvedValue(mockNotes);

            const { result } = renderHook(() => useNotes(), { wrapper });

            expect(result.current.isLoading).toBe(true);
            expect(result.current.data).toBeUndefined();

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.data).toBe(mockNotes);
            expect(result.current.isError).toBe(false);
            expect(getNotesPromise).toHaveBeenCalledTimes(1);
        });

        it("handles API errors", async () => {
            const error = new Error("API Error");
            getNotesPromise.mockRejectedValue(error);

            const { result } = renderHook(() => useNotes(), { wrapper });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.isError).toBe(true);
            expect(result.current.data).toBeUndefined();
            expect(result.current.error).toEqual(error);
        });

        it("uses correct query key", async () => {
            const mockNotes = "Test notes";
            getNotesPromise.mockResolvedValue(mockNotes);

            renderHook(() => useNotes(), { wrapper });

            await waitFor(() => {
                expect(getNotesPromise).toHaveBeenCalled();
            });

            // Check that the data is cached with the correct key
            const cachedData = queryCache.getQueryData([
                "lime-utils",
                "get_notes",
            ]);
            expect(cachedData).toBe(mockNotes);
        });

        it("accepts custom query config", async () => {
            const mockNotes = "Test notes";
            getNotesPromise.mockResolvedValue(mockNotes);

            const customConfig = {
                enabled: false,
                staleTime: 5000,
            };

            const { result } = renderHook(() => useNotes(customConfig), {
                wrapper,
            });

            // Query should not run due to enabled: false
            await waitFor(() => {
                expect(result.current.data).toBeUndefined();
            });
            expect(getNotesPromise).not.toHaveBeenCalled();
        });
    });

    describe("useSetNotes", () => {
        it("calls setNotesPromise when mutate is called", async () => {
            const mockResponse = { success: true };
            setNotesPromise.mockResolvedValue(mockResponse);

            const { result } = renderHook(() => useSetNotes(), { wrapper });

            const testNotes = "New notes content";

            act(() => {
                result.current.mutate(testNotes);
            });

            await waitFor(() => {
                expect(setNotesPromise).toHaveBeenCalledWith(testNotes);
            });

            expect(result.current.isError).toBe(false);
        });

        it("updates cache immediately on successful mutation", async () => {
            const mockResponse = { success: true };
            setNotesPromise.mockResolvedValue(mockResponse);

            // First, set some initial data in the cache
            queryCache.setQueryData(["lime-utils", "get_notes"], "Old notes");

            const { result } = renderHook(() => useSetNotes(), { wrapper });

            const newNotes = "Updated notes content";

            act(() => {
                result.current.mutate(newNotes);
            });

            await waitFor(() => {
                expect(setNotesPromise).toHaveBeenCalledWith(newNotes);
            });

            // Check that the cache was updated with the new notes
            const cachedData = queryCache.getQueryData([
                "lime-utils",
                "get_notes",
            ]);
            expect(cachedData).toBe(newNotes);
        });

        it("handles mutation errors", async () => {
            const error = new Error("Save failed");
            setNotesPromise.mockRejectedValue(error);

            const { result } = renderHook(() => useSetNotes(), { wrapper });

            act(() => {
                result.current.mutate("Test notes");
            });

            await waitFor(() => {
                expect(setNotesPromise).toHaveBeenCalled();
            });

            await waitFor(() => {
                expect(result.current.isError).toBe(true);
            });

            expect(result.current.error).toEqual(error);
        });

        it("can be called multiple times", async () => {
            const mockResponse = { success: true };
            setNotesPromise.mockResolvedValue(mockResponse);

            const { result } = renderHook(() => useSetNotes(), { wrapper });

            // First mutation
            act(() => {
                result.current.mutate("First notes");
            });

            await waitFor(() => {
                expect(setNotesPromise).toHaveBeenCalledWith("First notes");
            });

            // Second mutation
            act(() => {
                result.current.mutate("Second notes");
            });

            await waitFor(() => {
                expect(setNotesPromise).toHaveBeenCalledTimes(2);
            });

            expect(setNotesPromise).toHaveBeenNthCalledWith(1, "First notes");
            expect(setNotesPromise).toHaveBeenNthCalledWith(2, "Second notes");
        });
    });
});
