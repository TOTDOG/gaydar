<script setup lang="ts">
    import { onMounted, ref } from 'vue';
    import { Paramater, loadParams } from '../utils/parameter';
    import { generatePrompt } from '../utils/generation';
    
    const params = ref<Paramater[]>([]);
    const scenario = ref("Loading...");

    onMounted(async () => {
        params.value = await loadParams("/parameters.json");
        if (params.value.length > 0) {
            scenario.value = generatePrompt(params.value);
        } else {
            scenario.value = "No parameters found.";
        }
    });
</script>

<template>
    <p>{{ scenario }}</p>
</template>