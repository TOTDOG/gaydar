<script lang="ts">

</script>
<template>
    <div class="head-banner" style="position: relative;">
        <img class="logo" src="../assets/PNG/Asset 5@4x.png" alt="Company Logo"/>
        <div class="overlay"></div>
    </div>
    <div class="text-container">
    <h1>Hey</h1>
    </div>
</template>

<style scoped>
    .head-banner {
        height: fit-content;
        width: 100%;
        display: flex;
        justify-content: center;
    }
    .overlay {
        position: absolute;
        background-color: rgba(210, 116, 36, 0.5);
        height: 100%;
        width: 100%;
    }
    .logo {
        margin: 15px 0 0 0;
    }
    .text-container {
        background-color: rgb(184, 118, 59);
        border-top: 1px solid rgb(86, 50, 12);
    }
    .text-container p, .text-container h1 {
        margin: 0;
        color: rgb(86, 50, 12);
        
    }
</style>