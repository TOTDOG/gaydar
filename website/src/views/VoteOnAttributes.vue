<script lang="ts"></script>
<template>
    <div class="container">
        <div class="head-banner" style="position: relative">
            <img
                class="logo"
                src="../assets/PNG/Asset 5@4x.png"
                alt="Company Logo"
            />
            <div class="overlay"></div>
        </div>
        <div class="text-container">
            <h1>🚧Under Construction🚧</h1>
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
    background: linear-gradient(
        180deg,
        rgba(210, 113, 36, 0.5) 0%,
        rgba(210, 113, 36, 1) 100%
    );
    height: 100%;
    width: 100%;
}
.logo {
    margin: 15px 0 50px 0;
    max-width: 100%;
}
.text-container {
    background-color: #d27124;
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    padding-bottom: 20px;
}
.text-container p,
.text-container h1,
.text-container h2 {
    margin: 0;
    /* color: rgb(86, 50, 12); */
    color: wheat;
    display: flex;
    flex-direction: row;
}
.text-container h1,
.text-container h2 {
    justify-content: center;
}
.text-container h1 {
    margin-top: 10px;
    font-size: clamp(20px, 10vw, 32px);
}
.text-container h2 {
    margin-top: 10px;
    font-size: clamp(15px, 8vw, 25px);
}
.text-container p {
    margin: 10px 20px 0 20px;
    font-weight: 500;
    font-size: clamp(12px, 5vw, 20px);
}
</style>
