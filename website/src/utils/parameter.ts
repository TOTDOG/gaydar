export interface ParamaterData {
        name: string;
        classes: string[] | [number, number];
        contextualizer: string;
        description: string;
        formatOptions?: Intl.NumberFormatOptions
    }

export class Paramater {
    name:string;
    classes: string[] | [number, number];
    contextualizer: string;
    description: string;
    formatOptions?: Intl.NumberFormatOptions;

    constructor(data: ParamaterData) {
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
export async function loadParams(url: string): Promise<Paramater[]> {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to load JSON from ${url}: ${response.statusText}`);
        }

        // We cast the result to T (the generic type)
        const rawData: ParamaterData[] = await response.json();
        return rawData.map(item => new Paramater(
            item
        ));
    } catch (error) {
        console.error(error);
        return []
    }
}