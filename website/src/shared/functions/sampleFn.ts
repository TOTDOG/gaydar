import type {
    ContinuousValue,
    NominalValue,
    Parameter,
} from "../types/parameter.schema.js";
import type { SamplePoints } from "../types/samplePoints.schema.js";

function sample(samplePoints: SamplePoints, r: number): number {
    const { breakpoints, values } = samplePoints;

    // Find segment r falls in
    const i = breakpoints.findIndex((bp) => r < bp);
    if (i === 0 || i === -1) return values.at(-1)!;

    // Linear interpolation between surrounding points
    const r0 = breakpoints[i - 1],
        r1 = breakpoints[i];
    const x0 = values[i - 1],
        x1 = values[i];
    return x0 + ((r - r0) / (r1 - r0)) * (x1 - x0);
}

export function sampleParam(param: Parameter): NominalValue | ContinuousValue {
    const points = param.samplePoints;
    const r = Math.random();
    const index = sample(points, r);

    if (param.classes.length > 0) {
        return { class: param.classes[Math.round(index)] };
    } else {
        return param.decimals != null
      ? {value : parseFloat(index.toFixed(param.decimals))}
      : {value: index};
    }
}
