import { prisma } from "../lib/prisma.js";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import dotenv from "dotenv";
import { type } from "arktype";
import {
    ParameterSchema,
    type Parameter,
} from "../src/shared/types/parameter.schema.js";
import { buildUniformSamplerFn } from "./_lib/generateUniformSamplingFunction.js";
import { isAuthenticated } from "./_lib/session.js";
dotenv.config({ path: ".env.local", quiet: true });

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        if (req.method === "POST") {
            const parsedJson = ParameterSchema(req.body);
            if (parsedJson instanceof type.errors) {
                throw new Error(parsedJson.summary);
            }
            const parameter: Parameter = parsedJson;
            if (
                parameter.name === "" ||
                parameter.description.length < 20 ||
                !parameter.contextualizer.includes("${}") ||
                ((parameter.min === undefined || parameter.max === undefined) &&
                    parameter.classes.length < 2)
            ) {
                return res
                    .status(401)
                    .json({ message: "Unauthorized Database Write Attempt" });
            } else {
                if (parameter.classes.length >= 2) {
                    await prisma.parameter.create({
                        data: {
                            name: parameter.name,
                            active: isAuthenticated(req, res),
                            classes: parameter.classes,
                            samplePoints: buildUniformSamplerFn(parameter),
                            description: parameter.description,
                            contextualizer: parameter.contextualizer,
                            type: "nominal",
                        },
                    });
                    return res.status(200).json({
                        success: true,
                        message: "Added Parmeter Successfully",
                    });
                } else if (
                    parameter.min !== undefined &&
                    parameter.max !== undefined
                ) {
                    await prisma.parameter.create({
                        data: {
                            name: parameter.name,
                            min: parameter.min,
                            max: parameter.max,
                            active: isAuthenticated(req, res),
                            samplePoints: buildUniformSamplerFn(parameter),
                            description: parameter.description,
                            contextualizer: parameter.contextualizer,
                            decimals: parameter.decimals,
                            type: "continuous",
                        },
                    });
                    return res.status(200).json({
                        success: true,
                        message: "Added Parmeter Successfully",
                    });
                } else {
                    return res.status(401).json({
                        message: "Unauthorized Database Write Attempt",
                    });
                }
            }
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
