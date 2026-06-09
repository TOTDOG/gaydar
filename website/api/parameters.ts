import { type Parameter } from "../src/shared/types/parameter.schema.js";

export const parameters: Parameter[] = [
    {
        name: "money",
        active: true,
        classes: [],
        description:
            "The amount of money the person was paid to do the task in dollars",
        min: 0,
        max: 100000,
        samplePoints: { breakpoints: [0, 1], values: [0, 100000] },
        contextualizer: "paid ${} dollars",
        baselineVector: [0, 0],
        decimals: 0,
        id: "1",
    },
    {
        name: "tip",
        active: true,
        description: "The type of tip the person was hit with",
        classes: ["sml", "med", "lrg"],
        samplePoints: {
            breakpoints: [0.3333333333333333, 0.6666666666666666, 1],
            values: [0, 1, 2],
        },
        contextualizer: "hit with ${}",
        baselineVector: [0, 0],
        id: "2",
    },
];
