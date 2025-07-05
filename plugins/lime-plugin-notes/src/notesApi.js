import { map } from "rxjs/operators";

import api from "utils/uhttpd.service";

// Legacy RxJS-based API (for backward compatibility during migration)
export const getNotes = (wsAPI) =>
    wsAPI.call("lime-utils", "get_notes", {}).pipe(
        map((x) => {
            if (typeof x.notes === "undefined") {
                throw { error: true };
            }
            return x;
        })
    );

export const setNotes = (wsAPI, notes) =>
    wsAPI.call("lime-utils", "set_notes", notes);

// Modern Promise-based API
export const getNotesPromise = () =>
    api.call("lime-utils", "get_notes", {}).then((res) => {
        if (typeof res.notes === "undefined") {
            throw new Error("Notes not found");
        }
        return res.notes;
    });

export const setNotesPromise = (notes) =>
    api.call("lime-utils", "set_notes", { notes });
