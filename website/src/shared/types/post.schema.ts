import { scope } from "arktype"
import { ComparisonDataSchema, RankDataSchema } from "./prompt.schema.js"

const posts = scope({
    PostDataSchema: {
        structuralHash: "string",
        data: [RankDataSchema, "|", ComparisonDataSchema],
        sliderValue: "number"
    }
}).export()

export const { PostDataSchema } = posts
export type PostData = typeof PostDataSchema.infer