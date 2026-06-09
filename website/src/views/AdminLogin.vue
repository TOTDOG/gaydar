<script setup lang="ts">
import { ref } from "vue";
import {
    logIn,
    logOut,
    validateSession,
} from "../services/adminLoginServices.js";
import { hasAdminPrivledges } from "../stores/adminState.js";

const password = ref<string>("");
const errorMessage = ref<string>("");

async function logInAndUpdate() {
    errorMessage.value = (await logIn(password.value))
        ? ""
        : "Incorrect Password or sumthin (I was too lazy to handle any timeouts or other)";
    hasAdminPrivledges.value = await validateSession();
    password.value = "";
}
async function logOutAndUpdate() {
    await logOut();
    hasAdminPrivledges.value = await validateSession();
    password.value = "";
}
</script>

<template>
    <div class="container">
        <span class="banner"
            ><h1>
                If you are an admin, log in here to access admin priveledges.
            </h1></span
        >
        <span v-if="hasAdminPrivledges">
            <button @click="logOutAndUpdate">Log Out</button>
        </span>
        <span v-else
            ><input
                v-model="password"
                placeholder="Password"
                type="password"
                class="password"
                autocomplete="current-password"
            /><button @click="logInAndUpdate">Log In</button></span
        >
        <span class="error-message"
            ><p>{{ errorMessage }}</p></span
        >
    </div>
</template>

<style scoped>
.error-message p {
    color: rgba(196, 7, 7, 0.8);
    text-align: center;
}
span {
    display: flex;
    align-items: center;
    justify-content: center;
}
.banner {
    display: flex;
    justify-content: center;
}
.banner h1 {
    text-align: center;
    color: rgba(128, 54, 2, 0.733);
    margin-bottom: 20px;
}
input {
    field-sizing: content;
    max-width: 90%; /* Prevents the inputs from touching in the middle */
    font-weight: 500;
    font-size: clamp(12px, 5vw, 20px);

    /* Centers each input horizontally within its respective grid half */
    justify-self: center;
    /* Centers the text inside the input field */
    text-align: left;
    border: 2px solid rgba(80, 34, 1, 0.395);
    background: rgba(255, 255, 255, 0.75);
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
p,
h1,
h2,
button {
    margin: 0;
    /* color: rgb(86, 50, 12); */
    color: wheat;
    display: flex;
    flex-direction: row;
}
h1,
h2 {
    justify-content: center;
}
h1 {
    margin-top: 10px;
    font-size: clamp(20px, 9vw, 32px);
    font-weight: 700;
}
h2 {
    margin-top: 10px;
    font-size: clamp(15px, 8vw, 25px);
}
p {
    margin: 10px 20px 0 20px;
    font-weight: 500;
    font-size: clamp(12px, 5vw, 20px);
}
button {
    font-weight: 500;
    font-size: clamp(12px, 5vw, 20px);
    background-color: rgba(155, 65, 1, 0.395);
    position: relative;
    z-index: 1;
    justify-content: center;
    border: 2px solid rgb(166, 120, 88);
}
button:hover {
    cursor: pointer;
}
</style>
