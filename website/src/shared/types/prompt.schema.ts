import { scope } from "arktype";
import { SetParameterSchema } from "./parameter.schema.js";

const prompts = scope({
    ScenarioSchema: {
        paramSet: [SetParameterSchema, "[]"],
        text: "string"
    },
    RankDataSchema: {
        paramSet: [SetParameterSchema, "[]"]
    },
    ComparisonDataSchema: {
        paramSet0: [SetParameterSchema, "[]"],
        paramSet1: [SetParameterSchema, "[]"],
    },
    PromptSchema: {
        data: "RankDataSchema | ComparisonDataSchema",
        prompt: "string"
    },
    PromptResponseSchema: {
        prompt: "PromptSchema",
        structuralHash: "string",
    }
}).export()

export const {ScenarioSchema, RankDataSchema, ComparisonDataSchema, PromptSchema, PromptResponseSchema} = prompts
export type Scenario = typeof ScenarioSchema.infer
export type RankData = typeof RankDataSchema.infer
export type ComparisonData = typeof ComparisonDataSchema.infer
export type Prompt = typeof PromptSchema.infer
export type PromptResponse = typeof PromptResponseSchema.infer