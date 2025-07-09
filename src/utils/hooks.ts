import { useCallback, useEffect, useRef, useState } from "preact/hooks";

// Lightweight replacement for react-use useToggle
export function useToggle(initialState = false) {
    const [state, setState] = useState(initialState);

    const toggle = useCallback(() => setState((prev) => !prev), []);
    const setToggle = useCallback((value: boolean) => setState(value), []);

    return [state, toggle, setToggle] as const;
}

// Lightweight replacement for react-use useInterval
export function useInterval(callback: () => void, delay: number | null) {
    const savedCallback = useRef(callback);

    // Remember the latest callback
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval
    useEffect(() => {
        if (delay !== null) {
            const id = setInterval(() => savedCallback.current(), delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}
