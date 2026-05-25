import { type } from "arktype";

export const SamplePointsSchema = type({
    breakpoints: "number[]",
    values: "number[]"
})

export type SamplePoints = typeof SamplePointsSchema.infer