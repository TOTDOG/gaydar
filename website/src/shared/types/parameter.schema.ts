import { scope } from "arktype";
import { SamplePointsSchema } from "./samplePoints.schema.js";

const parameters = scope({
    ContinuousValueSchema: {
        value: "number",
    },
    NominalValueSchema: {
        class: "string",
    },
    SetParameterSchema: {
        value: "ContinuousValueSchema | NominalValueSchema",
        id: "string",
    },
    ParameterSchema: {
        active: "boolean",
        name: "string",
        id: "string",
        classes: "string[]",
        "min?": "number",
        "max?": "number",
        samplePoints: SamplePointsSchema,
        baselineVector: "number[]",
        description: "string",
        contextualizer: "string",
        "decimals?": "number",
    },
}).export();

export const {
    ContinuousValueSchema,
    NominalValueSchema,
    SetParameterSchema,
    ParameterSchema,
} = parameters;
export type ContinuousValue = typeof ContinuousValueSchema.infer;
export type NominalValue = typeof NominalValueSchema.infer;
export type SetParameter = typeof SetParameterSchema.infer;
export type Parameter = typeof ParameterSchema.infer;
