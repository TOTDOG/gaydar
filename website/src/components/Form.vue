<script setup lang="ts">

    class parameter {
        name:string;
        classes: string[] | [number, number];

        constructor(name: string, classes: string[] | [number, number]) {
            this.name = name;
            this.classes = classes;
        }
    }
    
    function generateScenario(params: [parameter]) {
        let userPrompt: string = ""
        for (let index = 0; index < params.length; index++) {
            const element = params[index];
            const classes = element.classes;
            if (typeof classes[0] === "number") {
                const min = classes[0]
                const max = classes[1] as number
                userPrompt += `${element.name}: ${Math.random() * (max - min) + min}`
            }
            else {
                userPrompt += `${element.name}: ${element.classes[Math.floor(Math.random() * element.classes.length)]}`
            }
        }
    }
    
</script>

<template>
    <p></p>
</template>