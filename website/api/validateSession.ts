import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated } from "./_lib/session.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (!isAuthenticated(req, res)) {
        return res.status(401).json({
            error: "Access Denied: Please log in first",
            valid: false,
        });
    }

    // Admin verified! Run your core administrative logic here:
    return res.status(200).json({
        valid: true,
    });
}
