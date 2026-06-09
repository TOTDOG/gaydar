import type { VercelRequest, VercelResponse } from "@vercel/node";
import { grantAccess } from "./_lib/session.js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local", quiet: true });

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { password } = req.body;

    // Compare incoming text against your master secret environment variable
    if (password === process.env.ADMIN_SHARED_PASSWORD) {
        grantAccess(req, res);
        return res
            .status(200)
            .json({ success: true, message: "Access granted" });
    }

    return res.status(401).json({ error: "Incorrect master admin password" });
}
