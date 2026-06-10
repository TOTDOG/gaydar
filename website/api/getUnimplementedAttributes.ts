import type { VercelRequest, VercelResponse } from "@vercel/node";
import { prisma } from "../lib/prisma.ts";
import type { Parameter } from "../src/shared/types/parameter.schema.js";
import type { SamplePoints } from "../src/shared/types/samplePoints.schema.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        if (req.method === "GET") {
            const paramRows = await prisma.parameter.findMany({
                where: { active: false },
            });
            const parameters: Parameter[] = paramRows.map((row) => ({
                name: row.name,
                active: row.active,
                id: row.id,
                classes: row.classes,
                samplePoints: row.samplePoints as SamplePoints,
                baselineVector: row.baselineVector,
                description: row.description,
                contextualizer: row.contextualizer,
                min: row.min ?? undefined,
                max: row.max ?? undefined,
                decimals: row.decimals ?? undefined,
            }));
            return res.status(200).json({
                success: true,
                message: "Successfully retrieved attributes",
                data: parameters,
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
