import Cookies from "cookies";
import crypto from "node:crypto";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local", quiet: true });

const COOKIE_NAME = "admin_authenticated";
const SESSION_TTL = 60 * 60 * 1; // Session lasts 8 hours before they have to re-type the password

// Generates a digital signature matching the environment secret
function getTimestampSignature(timestamp: string) {
    return crypto
        .createHmac("sha256", process.env.ADMIN_SIGNING_KEY!)
        .update(timestamp)
        .digest("hex");
}

export function isAuthenticated(
    req: VercelRequest,
    res: VercelResponse,
): boolean {
    const cookies = new Cookies(req, res);
    const cookieValue = cookies.get(COOKIE_NAME);

    if (!cookieValue) return false;

    // The cookie value now looks like: "timestamp.signature"
    const [timestampStr, clientSignature] = cookieValue.split(".");
    if (!timestampStr || !clientSignature) return false;

    // 1. TAMPER CHECK: Re-verify that the user didn't alter the timestamp text
    const expectedSignature = getTimestampSignature(timestampStr);
    if (clientSignature !== expectedSignature) return false;

    // 2. TIME CHECK: Check if the signed timestamp is older than 8 hours
    const sessionCreationTime = parseInt(timestampStr, 10);
    const isExpired = Date.now() - sessionCreationTime > SESSION_TTL * 1000;

    if (isExpired) {
        return false; // Sever-side rejection, regardless of browser cookie age!
    }

    return true;
}

export function grantAccess(req: VercelRequest, res: VercelResponse) {
    const isSecureContext =
        req.headers["x-forwarded-proto"] === "https" ||
        process.env.NODE_ENV === "production";

    const cookies = new Cookies(req, res, { secure: isSecureContext });

    // Capture the exact millisecond of login
    const timestamp = Date.now().toString();
    const signature = getTimestampSignature(timestamp);

    // Bundle them together into the cookie value
    const secureValue = `${timestamp}.${signature}`;
    cookies.set(COOKIE_NAME, secureValue, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: SESSION_TTL * 1000, // Still tell the browser to delete it automatically
        path: "/",
    });
}

// Revoke access instantly
export function revokeAccess(req: VercelRequest, res: VercelResponse) {
    const cookies = new Cookies(req, res);
    cookies.set(COOKIE_NAME, null, { path: "/" });
}
