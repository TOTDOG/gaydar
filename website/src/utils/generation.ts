import { Paramater } from "./parameter";
export function generateScenario(params: Paramater[], paramNumber: number) {
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
        const param: Paramater = params[significantIndices[i]];
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
export function generatePrompt(params: Paramater[]) {
    if (Math.random() > .3) {
        return `Rate this gayness from 0% to 100%: ${generateScenario(params, Math.random() * params.length)}.`;
    }
    else {
        return `Which of these is gayer? ${generateScenario(params, Math.random() * params.length)} or ${generateScenario(params, Math.random() * params.length)}.`;
    }
}