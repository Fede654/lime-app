import { useMutation, useQuery } from "@tanstack/react-query";

import queryCache from "utils/queryCache";

import { getNotesPromise, setNotesPromise } from "./notesApi";

export function useNotes(queryConfig) {
    return useQuery(["lime-utils", "get_notes"], getNotesPromise, queryConfig);
}

export function useSetNotes() {
    return useMutation(setNotesPromise, {
        onSuccess: (data, variables) => {
            // Update the cache immediately with the new notes value
            queryCache.setQueryData(["lime-utils", "get_notes"], variables);
        },
    });
}
