import "@testing-library/jest-dom";
import { screen } from "@testing-library/preact";

import { render } from "utils/test_utils";
import * as timeago from "utils/timeago";

import TimeAgo from "./timeAgo";

describe("time ago component", () => {
    it("formats raw data into  formated date", async () => {
        let date = new Date().getTime() / 1000;
        render(<TimeAgo timestamp={date} />);
        expect(
            await screen.findByText(timeago.format(date * 1000))
        ).toBeInTheDocument();
    });
});
