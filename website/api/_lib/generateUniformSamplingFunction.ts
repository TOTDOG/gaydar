import type { Parameter } from "../../src/shared/types/parameter.schema.js";
import type { SamplePoints } from "../../src/shared/types/samplePoints.schema.js";

export function buildUniformSamplerFn(param: Parameter): SamplePoints {
    if (param.classes.length >= 2) {
        const n = param.classes.length;
        return {
            breakpoints: Array.from({ length: n }, (_, i) => (i + 1) / n),
            values: Array.from({ length: n }, (_, i) => i),
        };
    } else {
        return {
            breakpoints: [0, 1],
            values: [param.min!, param.max!],
        };
    }
}
