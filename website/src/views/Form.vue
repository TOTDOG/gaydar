<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getPrompt } from "../services/promptService.js";
// import { submitData } from '../services/submitService';
import Slider from "primevue/slider";
import {
    RankDataSchema,
    type Prompt,
    type PromptResponse,
} from "../shared/types/prompt.schema.js";
import { submitData } from "../services/submitService.js";

const loading = ref(true);
const scenario = ref("");
const userInput = ref(0.5);
let hash: string;
let prompt: Prompt;
let expiration: number;
const isRankPrompt = ref(true);
const isSubmitting = ref(false);
onMounted(async () => {
    updateScenario();
});

async function updateScenario() {
    loading.value = true;
    scenario.value = "";
    let result: PromptResponse | undefined = await getPrompt();
    if (result !== undefined) {
        prompt = result.prompt;
        if (RankDataSchema.allows(prompt.data)) {
            isRankPrompt.value = true;
        } else {
            isRankPrompt.value = false;
        }
        scenario.value = prompt.prompt;
        hash = result.structuralHash;
        expiration = result.expiresAt;
        console.log(JSON.stringify(prompt.data));
    }
    loading.value = false;
}

async function submitForm() {
    isSubmitting.value = true;
    await submitData(prompt.data, hash, userInput.value, expiration);
    await updateScenario();
    isSubmitting.value = false;
}
</script>

<template>
    <div class="container">
        <p>{{ scenario }}</p>
        <div v-if="loading">
            <p>Loading...</p>
        </div>
        <div v-else-if="isRankPrompt" class="slider-container">
            <p>Not Gay</p>
            <Slider v-model="userInput" :min="0" :max="1" :step="0.01" />
            <p>Very Gay</p>
        </div>
        <div v-else class="slider-container">
            <p>Scenario 1</p>
            <Slider v-model="userInput" :min="0" :max="1" :step="0.01" />
            <p>Scenario 2</p>
        </div>
        <span class="submit-container">
            <button @click="submitForm" :disabled="isSubmitting">Submit</button>
        </span>
    </div>
</template>

<style scoped>
.submit-container {
    display: flex;
    justify-content: center;
}
.slider-container {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 10px 0 10px;
    margin: 10px 0 10px 0;
}
.slider-container p {
    font-size: clamp(8px, 3vw, 15px);
    margin: 0;
}
.slider-container .p-slider {
    flex: 1; /* makes the slider fill remaining space */
    background-color: wheat;
    --p-slider-range-background: rgb(155, 65, 1);
}
.container {
    height: 100%;
    background-color: #deb191;
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    padding-bottom: 20px;
}
</style>
