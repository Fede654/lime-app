import { useLingui } from "@lingui/react";

import { format, register } from "utils/timeago";

// No need to register locales - built into our implementation
register("es", null);
register("pt", null);
register("it", null);

type TimeAgoProps = {
    timestamp: number;
};

export const TimeAgo = ({ timestamp }: TimeAgoProps) => {
    const { i18n } = useLingui();
    return format(timestamp * 1000, i18n.locale);
};

export default TimeAgo;
