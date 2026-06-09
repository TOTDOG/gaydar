import { prisma } from "../lib/prisma.js";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
    PostDataSchema,
    type PostData,
} from "../src/shared/types/post.schema.js";
import crypto from "node:crypto";
import dotenv from "dotenv";
import { type } from "arktype";
import {
    RankDataSchema,
    type RankData,
    type ComparisonData,
} from "../src/shared/types/prompt.schema.js";
dotenv.config({ path: ".env.local", quiet: true });

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        if (req.method === "POST") {
            const parsedJson = PostDataSchema(req.body);
            if (parsedJson instanceof type.errors) {
                throw new Error(parsedJson.summary);
            }
            const postData: PostData = parsedJson;
            if (Date.now() > postData.expiresAt) {
                return res.status(401).json({ message: "Prompt Expired" });
            }
            let structuralString: string = "";
            const SUBMIT_SECRET_KEY = process.env.SUBMIT_SECRET_KEY;
            if (!SUBMIT_SECRET_KEY) {
                return res.status(500).json({
                    success: false,
                    message:
                        "Internal Server Error: Secret configuration missing.",
                });
            }
            if (RankDataSchema.allows(postData.data)) {
                const sortedParams = [...postData.data.paramSet].sort((a, b) =>
                    a.id.localeCompare(b.id),
                );
                structuralString = JSON.stringify([
                    ...sortedParams.map((x) => x.id),
                    ...sortedParams.map((x) => x.value),
                ]);
            } else {
                const sortedParams0 = [...postData.data.paramSet0].sort(
                    (a, b) => a.id.localeCompare(b.id),
                );
                const sortedParams1 = [...postData.data.paramSet1].sort(
                    (a, b) => a.id.localeCompare(b.id),
                );
                structuralString = JSON.stringify([
                    ...sortedParams0.map((x) => x.id),
                    ...sortedParams0.map((x) => x.value),
                    "break",
                    ...sortedParams1.map((x) => x.id),
                    ...sortedParams1.map((x) => x.value),
                ]);
            }
            structuralString += `-${postData.expiresAt}`;
            const structuralHash = crypto
                .createHmac("sha256", SUBMIT_SECRET_KEY)
                .update(structuralString)
                .digest("hex");
            if (structuralHash === postData.structuralHash) {
                if (RankDataSchema.allows(postData.data)) {
                    const data: RankData = postData.data;
                    await prisma.rank.create({
                        data: {
                            setParameters: data.paramSet,
                            rank: postData.sliderValue,
                        },
                    });
                } else {
                    const data: ComparisonData = postData.data;
                    await prisma.comparison.create({
                        data: {
                            setParameters0: data.paramSet0,
                            setParameters1: data.paramSet1,
                            relate: postData.sliderValue,
                        },
                    });
                }
                return res.status(200).json({
                    success: true,
                    message: "Added Data Successfully",
                });
            } else
                return res
                    .status(401)
                    .json({ message: "Unauthorized Database Write Attempt" });
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
