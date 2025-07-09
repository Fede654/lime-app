/* eslint @typescript-eslint/no-empty-function: "off" */
import { Trans } from "@lingui/macro";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";

import { useBoardData } from "utils/queries";

import { useNotes, useSetNotes } from "./notesQueries";
import style from "./style.less";

export const Page = () => {
    const { data: boardData } = useBoardData();
    const { data: notes = "", isLoading } = useNotes();
    const setNotesMutation = useSetNotes();

    // Use a more straightforward approach - only sync when component mounts
    const [value, setValue] = useState("");
    const [hasInitialized, setHasInitialized] = useState(false);
    const [isUserEditing, setIsUserEditing] = useState(false);
    const valueRef = useRef("");

    // Keep ref in sync with current value
    useEffect(() => {
        valueRef.current = value;
    }, [value]);

    function handleChange(event) {
        setValue(event.target.value);
        setIsUserEditing(true);
    }

    const saveNotes = useCallback(() => {
        // Use ref to get the absolute current value at time of save
        const currentValue = valueRef.current;
        setNotesMutation.mutate(currentValue);
        setIsUserEditing(false); // Reset editing state after save
    }, [setNotesMutation]);

    // Initialize when notes data is available and handle external updates
    useEffect(() => {
        if (notes && !hasInitialized) {
            setValue(notes);
            setHasInitialized(true);
        } else if (
            hasInitialized &&
            !isUserEditing &&
            notes !== value &&
            notes !== ""
        ) {
            // Only handle external updates when user is not actively editing
            setValue(notes);
        }
    }, [notes, hasInitialized, isUserEditing, value]);

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
