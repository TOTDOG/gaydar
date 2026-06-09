import type { VercelRequest, VercelResponse } from "@vercel/node";
import { revokeAccess } from "./_lib/session.js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local", quiet: true });

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== "POST") return res.status(405).end();

    revokeAccess(req, res);
    return res
        .status(200)
        .json({ success: true, message: "Logged out successfully" });
}
