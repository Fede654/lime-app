/* eslint @typescript-eslint/no-empty-function: "off" */
import { Trans } from "@lingui/macro";
import { useEffect, useState } from "preact/hooks";

import { useBoardData } from "utils/queries";

import { useNotes, useSetNotes } from "./notesQueries";
import style from "./style.less";

export const Page = () => {
    const { data: boardData } = useBoardData();
    const { data: notes = "", isLoading } = useNotes();
    const setNotesMutation = useSetNotes();
    const [value, setValue] = useState(notes || "");

    function handleChange(event) {
        setValue(event.target.value);
    }

    function saveNotes() {
        setNotesMutation.mutate(value);
    }

    // Update local state when notes data changes
    useEffect(() => {
        setValue(notes);
        return () => {};
    }, [notes]);

    return (
        <div className="container container-padded">
            <h4>
                <span>
                    <Trans>Notes of</Trans>
                </span>{" "}
                {boardData?.hostname || "Loading..."}
            </h4>
            <textarea
                onChange={handleChange}
                className={style.notes}
                value={value}
            />
            <button
                disabled={isLoading || setNotesMutation.isLoading}
                onClick={saveNotes}
            >
                <Trans>Save notes</Trans>
            </button>
        </div>
    );
};

export default Page;
