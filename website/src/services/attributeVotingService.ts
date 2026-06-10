import { type } from "arktype";
import { ParameterSchema } from "../shared/types/parameter.schema.js";

export async function getUnimplementedAttributes() {
    try {
        // Step A: The Network Request
        const response = await fetch("/api/getUnimplementedAttributes");

        // Step B: Guarding Against Server Failures
        if (!response.ok) {
            throw new Error(`Server returned status: ${response.status}`);
        }

        const result = await response.json();
        const prompts = ParameterSchema.array()(result.data);
        if (prompts instanceof type.errors) {
            throw new Error(prompts.summary);
        }
        return prompts;
    } catch (error) {
        console.error(error);
    }
}
