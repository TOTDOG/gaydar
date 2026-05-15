import { readFile } from 'fs/promises';
export interface ParameterData {
        name: string;
        classes: string[] | [number, number];
        contextualizer: string;
        description: string;
        formatOptions?: Intl.NumberFormatOptions
    }

export class Parameter {
    name:string;
    classes: string[] | [number, number];
    contextualizer: string;
    description: string;
    formatOptions?: Intl.NumberFormatOptions;

    constructor(data: ParameterData) {
        this.name = data.name;
        this.description = data.description;
        this.classes = data.classes;
        this.contextualizer = data.contextualizer;
        this.formatOptions = data.formatOptions
    }
    /**
     * contextualie
     */
    public contextualize(value: string) {
        return this.contextualizer.replace("_", value)
    }
    public get_random_value() {
        if (typeof this.classes[0] === "number") {
            const min = this.classes[0];
            const max = this.classes[1] as number;
            let value:string = `${Math.random() * (max - min) + min}`
            if (this.formatOptions) {
                value = Intl.NumberFormat('en-US', this.formatOptions).format(Number(value))
            } 
            return value;
        }
        else {
            return `${this.classes[Math.floor(Math.random() * this.classes.length)]}`;
        }
    }
}

export async function loadParams(filePath: string): Promise<Parameter[]> {
    try {
        const raw = await readFile(filePath, 'utf-8');
        const rawData: ParameterData[] = JSON.parse(raw);
        return rawData.map(item => new Parameter(item));
    } catch (error) {
        console.error(error);
        return [];
    }
}