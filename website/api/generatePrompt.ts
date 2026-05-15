import { loadParams, Parameter } from "./parameter.js"
import type { VercelRequest, VercelResponse } from '@vercel/node';
import path from 'path';

export function generateScenario(params: Parameter[], paramNumber: number) {
    let fullSentence: string = "The person was ";
    let allIndices: number[] = [];
    for (let i = 0; i < params.length; i++) {
        allIndices.push(i);
    }
    let significantIndices: number[] = [];
    for (let i = 0; i < paramNumber; i++) {
        const index: number = Math.floor(Math.random()*allIndices.length);
        significantIndices.push(allIndices[index]);
        allIndices.splice(index, 1);
    }
    for (let i = 0; i < significantIndices.length; i++) {
        const param: Parameter = params[significantIndices[i]];
        if (i == significantIndices.length - 1) {
            if (i > 0) {
                fullSentence += `and ${param.contextualize(param.get_random_value())}`;
            }
            else {
                fullSentence += `${param.contextualize(param.get_random_value())}`;
            }
        }
        else {
            fullSentence += `${param.contextualize(param.get_random_value())}, `;
        }
    }
    return fullSentence;
}
export function generatePrompt(params: Parameter[]) {
    if (Math.random() > .3) {
        return `Rate this gayness from 0% to 100%: ${generateScenario(params, Math.floor(Math.random() * params.length + 1))}.`;
    }
    else {
        return `Which of these is gayer? ${generateScenario(params, Math.floor(Math.random() * params.length + 1))} or ${generateScenario(params, Math.floor(Math.random() * params.length + 1))}.`;
    }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        if (req.method === "GET") {
            const jsonPath = path.join(process.cwd(), 'data', 'parameters.json');
            const parameters = await loadParams(jsonPath);
            const promptResult = generatePrompt(parameters);
            return res.status(200).json({
                success: true,
                message: 'prompt created successfully',
                data: promptResult
            });
        }
        else {
            return res.status(405).json({ message: 'Method not allowed' });
        }
    } catch (error) {
        return res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : String(error)
            });
    }
}