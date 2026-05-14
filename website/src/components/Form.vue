<script setup lang="ts">
    import { onMounted, ref } from 'vue';

    interface ParamaterData {
        name: string;
        classes: string[] | [number, number];
        contextualizer: string;
        description: string;
        formatOptions?: Intl.NumberFormatOptions
    }
    class Paramater {
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
    
    function generateScenario(params: Paramater[]) {
        let fullSentence: string = "The person was ";
        let allIndices: number[] = [];
        for (let i = 0; i < params.length; i++) {
            allIndices.push(i);
        }
        const range: number = Math.random() * allIndices.length;
        let significantIndices: number[] = [];
        for (let i = 0; i < range; i++) {
            const index: number = Math.floor(Math.random()*allIndices.length);
            significantIndices.push(allIndices[index]);
            allIndices.splice(index, 1);
        }
        for (let i = 0; i < significantIndices.length; i++) {
            const param: Paramater = params[significantIndices[i]];
            if (i == significantIndices.length - 1) {
                if (i > 0) {
                    fullSentence += `and ${param.contextualize(param.get_random_value())}.`;
                }
                else {
                    fullSentence += `${param.contextualize(param.get_random_value())}.`;
                }
            }
            else {
                fullSentence += `${param.contextualize(param.get_random_value())}, `;
            }
        }
        return fullSentence;
    }
    async function loadParams(url: string): Promise<Paramater[]> {
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
    const params = ref<Paramater[]>([]);
    const scenario = ref("Loading...");

    onMounted(async () => {
        params.value = await loadParams("/parameters.json");
        if (params.value.length > 0) {
            scenario.value = generateScenario(params.value);
        } else {
            scenario.value = "No parameters found.";
        }
    });
</script>

<template>
    <p>{{ scenario }}</p>
</template>