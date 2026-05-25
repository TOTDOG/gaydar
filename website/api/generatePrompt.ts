import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "crypto";
import dotenv from "dotenv";
import { parameters } from "./parameters.js";
import {
    RankDataSchema,
    type Prompt,
    type PromptResponse,
    type Scenario,
} from "../src/shared/types/prompt.schema.js";
import {
    ContinuousValueSchema,
    type ContinuousValue,
    type NominalValue,
    type Parameter,
    type SetParameter,
} from "../src/shared/types/parameter.schema.js";
import { sampleParam } from "../src/shared/functions/sampleFn.js";
dotenv.config({ path: ".env.local", quiet: true });

export function generateScenario(params: Parameter[], paramNumber: number) {
    let fullSentence: string = "the person was ";
    let allIndices: number[] = [];
    for (let i = 0; i < params.length; i++) {
        allIndices.push(i);
    }
    let significantIndices: number[] = [];
    for (let i = 0; i < paramNumber; i++) {
        const index: number = Math.floor(Math.random() * allIndices.length);
        significantIndices.push(allIndices[index]);
        allIndices.splice(index, 1);
    }
    let ids: number[] = [];
    let values: (ContinuousValue | NominalValue)[] = [];
    for (let i = 0; i < significantIndices.length; i++) {
        const param: Parameter = params[significantIndices[i]];
        ids.push(params[significantIndices[i]].id);
        const value: ContinuousValue | NominalValue = sampleParam(param);
        values.push(value);
        let interpValue;
        if (ContinuousValueSchema.allows(value)) {
            interpValue = value.value;
        } else {
            interpValue = value.class;
        }
        if (i == significantIndices.length - 1) {
            if (i > 0) {
                fullSentence += `and ${param.contextualizer.replace("${}", `${interpValue}`)}`;
            } else {
                fullSentence += `${param.contextualizer.replace("${}", `${interpValue}`)}`;
            }
        } else {
            fullSentence += `${param.contextualizer.replace("${}", `${interpValue}`)}, `;
        }
    }
    const scenario: Scenario = {
        paramSet: Array.from<unknown, SetParameter>(
            { length: ids.length },
            (_, i) => ({ id: ids[i], value: values[i] }),
        ),
        text: fullSentence,
    };
    return scenario;
}
export function generatePrompt(params: Parameter[]) {
    if (Math.random() < 0.3) {
        const promptScenario: Scenario = generateScenario(
            params,
            Math.floor(Math.random() * params.length + 1),
        );
        const rankPrompt: Prompt = {
            data: { paramSet: promptScenario.paramSet },
            prompt: `Rate this gayness from 0% to 100%: ${promptScenario.text}.`,
        };
        return rankPrompt;
    } else {
        const promptScenario0: Scenario = generateScenario(
            params,
            Math.floor(Math.random() * params.length + 1),
        );
        const promptScenario1: Scenario = generateScenario(
            params,
            Math.floor(Math.random() * params.length + 1),
        );
        const comparisonPrompt: Prompt = {
            data: {
                paramSet0: promptScenario0.paramSet,
                paramSet1: promptScenario1.paramSet,
            },
            prompt: `Which of these is gayer? ${promptScenario0.text} or ${promptScenario1.text}.`,
        };
        return comparisonPrompt;
    }
}
//Add cryptographic hashing
export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        if (req.method === "GET") {
            const promptResult: Prompt = generatePrompt(parameters);
            const SUBMIT_SECRET_KEY = process.env.SUBMIT_SECRET_KEY;
            if (!SUBMIT_SECRET_KEY) {
                return res.status(500).json({
                    success: false,
                    message:
                        "Internal Server Error: Secret configuration missing.",
                });
            }
            let structuralString: string = "";
            if (RankDataSchema.allows(promptResult.data)) {
                const sortedParams = [...promptResult.data.paramSet].sort(
                    (a, b) => a.id - b.id,
                );
                structuralString = JSON.stringify([
                    ...sortedParams.map((x) => x.id),
                    ...sortedParams.map((x) => x.value),
                ]);
            } else {
                const sortedParams0 = [...promptResult.data.paramSet0].sort(
                    (a, b) => a.id - b.id,
                );
                const sortedParams1 = [...promptResult.data.paramSet1].sort(
                    (a, b) => a.id - b.id,
                );
                structuralString = JSON.stringify([
                    ...sortedParams0.map((x) => x.id),
                    ...sortedParams0.map((x) => x.value),
                    "break",
                    ...sortedParams1.map((x) => x.id),
                    ...sortedParams1.map((x) => x.value),
                ]);
            }
            const structuralHash = crypto
                .createHmac("sha256", SUBMIT_SECRET_KEY)
                .update(structuralString)
                .digest("hex");

            const response: PromptResponse = {
                prompt: promptResult,
                structuralHash: structuralHash,
            };
            return res.status(200).json({
                success: true,
                message: "prompt created successfully",
                data: response,
            });
        } else {
            return res.status(405).json({ message: "Method not allowed" });
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : String(error),
        });
    }
}
