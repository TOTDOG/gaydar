<script setup lang="ts">
    import { onMounted, ref } from 'vue';
    import { getPrompt } from '../services/promptService';

    const scenario = ref("Loading...");
    const userInput = ref("")

    onMounted(async () => {
        updateScenario()
    });
    
    async function updateScenario() {
        scenario.value = await getPrompt()
    }
</script>

<template>
    <p>{{ scenario }}</p>
    <input v-model="userInput"/>
    <button @click="updateScenario">Generate Scenario</button>
    <button>Submit</button>
</template>