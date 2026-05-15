export async function getPrompt() {
    try {
        // Step A: The Network Request
        const response = await fetch('/api/generatePrompt');

        // Step B: Guarding Against Server Failures
        if (!response.ok) {
            throw new Error(`Server returned status: ${response.status}`);
        }

        const result = (await response.json())
        return result.data
    } catch (error) {
        console.error(error)
        return "Error generating prompt"
    }
}