<script setup lang="ts">
    import { onMounted, ref } from 'vue';
    import { getPrompt } from '../services/promptService.js';
    // import { submitData } from '../services/submitService';
    import Slider from 'primevue/slider'
    import { RankDataSchema, type Prompt, type PromptResponse } from '../shared/types/prompt.schema.js';
import { submitData } from '../services/submitService.js';

    const scenario = ref("Loading...");
    const userInput = ref(.5);
    let hash: string;
    let prompt: Prompt;
    const isRankPrompt = ref(true)
    const isSubmitting = ref(false)
    onMounted(async () => {
        updateScenario()
    });
    
    async function updateScenario() {
        let result: PromptResponse | undefined = await getPrompt();
        if (result !== undefined) {
            prompt = result.prompt
            if (RankDataSchema.allows(prompt.data)) {
                isRankPrompt.value = true
            }
            else {
                isRankPrompt.value = false
            }
            scenario.value = prompt.prompt;
            hash = result.structuralHash;
            console.log(JSON.stringify(prompt.data))
        }
    }
    
    async function submitForm() {
        isSubmitting.value = true
        await submitData(prompt.data, hash, userInput.value)
        await updateScenario()
        isSubmitting.value = false

    }
</script>

<template>
    <p>{{ scenario }}</p>
    <div  v-if="isRankPrompt" class="slider-container">
        <span>Not Gay</span>
        <Slider v-model="userInput" :min="0" :max="1" :step=".01" />
        <span>Very Gay</span>
    </div>
    <div  v-else class="slider-container">
        <span>Scenario 1</span>
        <Slider v-model="userInput" :min="0" :max="1" :step=".01" />
        <span>Scenario 2</span>
    </div>
    <button @click="submitForm" :disabled="isSubmitting">Submit</button>
</template>

<style scoped>
    .slider-container {
    display: flex;
    align-items: center;
    gap: 12px;
    }

    .slider-container .p-slider {
    flex: 1;  /* makes the slider fill remaining space */
    }
</style>