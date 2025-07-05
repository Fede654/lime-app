import { Trans } from "@lingui/macro";
import { useEffect, useState } from "preact/hooks";

import { useBoardData } from "utils/queries";

import { useCloudNodes } from "./changeNodeQueries";

export const ChangeNode = () => {
    const { data: boardData } = useBoardData();
    const { data: stations = [] } = useCloudNodes();

    const [state, setState] = useState({
        station: boardData && boardData.hostname,
    });

    useEffect(() => {
        if (boardData?.hostname) {
            setState({
                station: boardData.hostname,
            });
        }
        return () => {};
    }, [boardData]);

    function handleChange(e) {
        setState({ station: e.target.value });
        e.target.value;
    }

    function nextStation(e) {
        e.preventDefault();
        if (typeof state.station !== "undefined") {
            window.location.href = "http://".concat(state.station);
        }
    }

    function sortStations(stations) {
        if (!boardData?.hostname) return stations.sort();
        const result = stations.filter((x) => x !== boardData.hostname).sort();
        result.push(boardData.hostname);
        return result;
    }

    return (
        <div className="container container-padded">
            <h4>
                <Trans>Visit a neighboring node</Trans>
            </h4>
            <p>
                <Trans>
                    Select another node and use the LimeApp as you were there
                </Trans>
            </p>
            <form onSubmit={nextStation}>
                <p>
                    <label>
                        <Trans>Select new node</Trans>
                    </label>
                    <select
                        className="u-full-width"
                        onChange={handleChange}
                        value={state.station}
                    >
                        {sortStations(stations).map((x, y) => (
                            <option value={x} key={y}>
                                {x}
                            </option>
                        ))}
                    </select>
                </p>
                <button className="button block" type="submit">
                    <Trans>Visit</Trans>
                </button>
            </form>
        </div>
    );
};

export default ChangeNode;
