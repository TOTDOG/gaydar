import { type } from "arktype";
import { PromptResponseSchema } from "../shared/types/prompt.schema.js";

export async function getPrompt() {
    try {
        // Step A: The Network Request
        const response = await fetch('/api/generatePrompt');

        // Step B: Guarding Against Server Failures
        if (!response.ok) {
            throw new Error(`Server returned status: ${response.status}`);
        }
        //need to add logic for different types of prompts
        const result = (await response.json())
        const promptResponse = PromptResponseSchema(result.data)
        if (promptResponse instanceof type.errors) {
            throw new Error(promptResponse.summary)
        }
        return promptResponse
    } catch (error) {
        console.error(error)
    }
}