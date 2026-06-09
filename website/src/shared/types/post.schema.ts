import { scope } from "arktype";
import { ComparisonDataSchema, RankDataSchema } from "./prompt.schema.js";
import { ParameterSchema } from "./parameter.schema.js";

const posts = scope({
    PostDataSchema: {
        structuralHash: "string",
        data: [RankDataSchema, "|", ComparisonDataSchema],
        sliderValue: "number",
        expiresAt: "number",
    },
    PostParamSchema: {
        parameter: ParameterSchema,
    },
}).export();

export const { PostDataSchema } = posts;
export type PostData = typeof PostDataSchema.infer;
