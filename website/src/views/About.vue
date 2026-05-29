<script lang="ts">

</script>
<template>
    <div class="container">
       <div class="head-banner" style="position: relative;">
            <img class="logo" src="../assets/PNG/Asset 5@4x.png" alt="Company Logo"/>
            <div class="overlay"></div>
        </div>
        <div class="text-container">
            <h1>About</h1>
            <p>&emsp;TOTDOG is an effort to create and train an ai to provide a definitely unbiased estimator of gayness of someone (or something) according to the "free internet". We have decided to call this ai GAYDAR, because we (and by that I mean me, because I didn't consult my partners) thought the name was fitting.</p>
            <br/>
            <h2>The Process</h2>
            <p>&emsp;Data is collected from YOU! You get to decide how our ai determines gayness. Every prompt submitted by anyone who contributes is used to train GAYDAR. Prompts are created by randomly creating scenarios from a database of attributes that we think would contribute to gayness. Prompts either have you compare two scenarios for which is gayer, or have you determine the absolute gayness for a scenario, from not gay to very gay. You have the option to suggest attributes you'd like our ai to train on, and we will determine whether or not it is relevant. In the future, a voting system will be implemented to automate this process.</p>
            <br/>
            <h2>The Architecture</h2>
            <p>&emsp;The structure of GAYDAR is somewhat complicated. As a disclaimer, I don't know what I'm doing. Anyways, the architecture is a multi-model architecture. For each attribute, there is a seperate backbone model that evaluates the input for that attribute. Each of these backbones then feeds embeddings into a shared head, which evaluates them in a transformer-esque architecture and outputs a value 0-1, representing not gay and very gay. Each backbone model can be turned on or off during inference, so not all attributes will be necessary to predict gayness. The output layer of the model has 3 quantiles: q.1, q.5, and q.9. This allows us to determine the uncertainty of a prediction, q.9 - q.1, which we use when sampling. The distribution of sampling for any attribute is then determined by evaluating a KDE based on the uncertainty of the model for that attribute. The greatest 25% uncertainty values in a range we test are used to make this KDE. The rate of sampling a particular attribute will be determined by comparing a baseline projection of the head models weights and biases to a current projection. The higher the shift, the higher the sampling. Also, the higher the sampling, the more the baseline shifts towards the current projection. Additionally, higher loss during training for an attribute means higher sampling rate. This hopefully creates a self-balancing network that determines where and when it needs more information.</p>
            <h1>Contact</h1>
            <p>&emsp;I am not a statistician or an ml engineer, so anything I say could be mistaken or sub-optimal. If so feel free to contact us at sliprandalllovers@gmail.com, we would love advice.</p>
        </div>
    </div>
</template>

<style scoped>
    .container {
        overflow: auto;
        height: 100%;
        scrollbar-width: none;
        -ms-overflow-style: none;
    }
    .container::-webkit-scrollbar {
        display: none;
    }
    .head-banner {
        height: fit-content;
        width: 100%;
        display: flex;
        justify-content: center;
    }
    .overlay {
        position: absolute;
        background: linear-gradient(180deg,rgba(210, 113, 36, 0.5) 0%, rgba(210, 113, 36, 1) 100%);
        height: 100%;
        width: 100%;
    }
    .logo {
        margin: 15px 0 50px 0;
        max-width: 100%;
    }
    .text-container {
        background-color: #D27124;
        width: 100%;
        flex: 1;
        display: flex;
        flex-direction: column;
        position: relative;
        padding-bottom: 20px;
    }
    .text-container p, .text-container h1, .text-container h2 {
        margin: 0;
        /* color: rgb(86, 50, 12); */
        color: wheat;
        display: flex;
        flex-direction: row;
    }
    .text-container h1, .text-container h2 {
        justify-content: center;
    }
    .text-container h1 {
        margin-top: 10px;
        font-size: clamp(20px, 10vw, 32px)
    }
    .text-container h2 {
        margin-top: 10px;
        font-size: clamp(15px, 8vw, 25px)
    }
    .text-container p {
        margin: 10px 20px 0 20px;
        font-weight: 500;
        font-size: clamp(12px, 5vw, 20px);
    }
</style>