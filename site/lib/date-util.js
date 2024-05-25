import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrBefore);

export function dateSequence(dates, step = 1, unit = 'day') {
    const [start, end] = dates.map(d => dayjs(d)).sort((a, b) => a.valueOf() - b.valueOf());
    return [...(function* () {
        let run = dayjs(start);
        while (run.isSameOrBefore(end, unit)) {
            yield run;
            run = run.add(step, unit);
        }
    })()];
}