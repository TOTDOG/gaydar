import type { PostData } from "../shared/types/post.schema.js";
import { type ComparisonData, type RankData } from "../shared/types/prompt.schema.js";

export async function submitData(data: RankData | ComparisonData, structuralHash: string, sliderValue: number) {
    try {
        let postData: PostData = {structuralHash: structuralHash, data: data, sliderValue: sliderValue};
        const response = await fetch('/api/submitData', 
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            }
        );

        // Step B: Guarding Against Server Failures
        if (!response.ok) {
            throw new Error(`Server returned status: ${response.status}`);
        }
    } catch (error) {
        console.error(error)
    }
}