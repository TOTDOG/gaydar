import type { Parameter } from "../shared/types/parameter.schema.js";

export async function proposeAttribute(data: Parameter) {
    try {
        const response = await fetch("/api/submitParameter", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        // Step B: Guarding Against Server Failures
        if (!response.ok) {
            throw new Error(`Server returned status: ${response.status}`);
        }
    } catch (error) {
        console.error(error);
    }
}
