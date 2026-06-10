<script setup lang="ts">
import { ref } from "vue";
import { type Parameter } from "../shared/types/parameter.schema";
import { proposeAttribute } from "../services/proposeAttributeService.ts";

const continuousSelected = ref(true);
const nominalClasses = ref<string[]>([]);
const nominalInput = ref("");
const minValue = ref<string>("");
const maxValue = ref<string>("");
const name = ref<string>("");
const description = ref<string>("");
const decimals = ref<string>("");
const contextualizer = ref<string>("");
const errorMessage = ref<string>("");
const allowOnlyDecimals = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    let val = target.value;
    val = val.replace(/[^0-9.]/g, "");
    const periods = val.split(".");
    if (periods.length > 2) {
        val = periods[0] + "." + periods.slice(1).join("");
    }
    target.value = val;
    target.dispatchEvent(new Event("input"));
};
async function submitNewAttribute() {
    let submission: Parameter;
    if (!continuousSelected.value) {
        if (name.value === "") {
            errorMessage.value = "Please input name";
        } else {
            errorMessage.value = "";
        }
        if (description.value.length === 0) {
            errorMessage.value = "Please input description";
        } else if (description.value.length < 20) {
            errorMessage.value = "Please input a more detailed description";
        } else {
            errorMessage.value = "";
        }
        if (!contextualizer.value.includes("${}")) {
            errorMessage.value = "Please include ${} in your response";
        } else {
            errorMessage.value = "";
        }
        if (nominalClasses.value.length < 2) {
            errorMessage.value =
                "Nominal attributes must have at least two classes";
        } else {
            errorMessage.value = "";
        }
        if (errorMessage.value === "") {
            submission = {
                active: false,
                name: name.value,
                id: "",
                classes: nominalClasses.value,
                samplePoints: { breakpoints: [], values: [] },
                baselineVector: [],
                description: description.value,
                contextualizer: contextualizer.value,
            };
            name.value = "";
            description.value = "";
            contextualizer.value = "";
            minValue.value = "";
            maxValue.value = "";
            nominalClasses.value = [];
            await proposeAttribute(submission);
        }
    } else {
        if (name.value === "") {
            errorMessage.value = "Please input name";
        } else {
            errorMessage.value = "";
        }
        if (description.value.length === 0) {
            errorMessage.value = "Please input description";
        } else if (description.value.length < 20) {
            errorMessage.value = "Please input a more detailed description";
        } else {
            errorMessage.value = "";
        }
        if (!contextualizer.value.includes("${}")) {
            errorMessage.value = "Please include ${} in your response";
        } else {
            errorMessage.value = "";
        }
        if (
            minValue.value.trim() === "" ||
            maxValue.value.trim() === "" ||
            Number.isNaN(Number(minValue.value)) ||
            Number.isNaN(Number(maxValue.value))
        ) {
            errorMessage.value =
                "Continuous attributes must have a min and max";
        } else {
            errorMessage.value = "";
        }
        if (errorMessage.value === "") {
            submission = {
                active: false,
                name: name.value,
                id: "",
                classes: [],
                min: Number(minValue.value),
                max: Number(maxValue.value),
                samplePoints: { breakpoints: [], values: [] },
                baselineVector: [],
                description: description.value,
                contextualizer: contextualizer.value,
            };
            if (
                decimals.value.trim() === "" ||
                Number.isNaN(Number(decimals.value))
            ) {
                submission.decimals = Number(decimals.value);
            }
            name.value = "";
            description.value = "";
            contextualizer.value = "";
            minValue.value = "";
            maxValue.value = "";
            nominalClasses.value = [];
            await proposeAttribute(submission);
        }
    }
}
</script>

<template>
    <div class="container">
        <h1>Propose An Attribute!</h1>
        <span class="attribute-type-options">
            <div
                class="overlay"
                :class="{ rightSide: !continuousSelected }"
            ></div>
            <button
                @click="continuousSelected = true"
                :class="{ active: continuousSelected }"
            >
                Continuous
            </button>
            <button
                @click="continuousSelected = false"
                :class="{ active: !continuousSelected }"
            >
                Nominal
            </button>
        </span>
        <span class="name-input">
            <input v-model="name" placeholder="Attribute Name" type="text"
        /></span>
        <span class="name-input">
            <textarea
                v-model="description"
                placeholder="Describe this attribute, what it is, what happens, etc. (this is important)"
            ></textarea>
        </span>
        <span class="name-input">
            <textarea
                v-model="contextualizer"
                placeholder='Write how you want this to be prompted using ${} as a placeholder for whatever value you want. Everything starts with "the person ". Example: If you want it to say "the person was paid 12 dollars", enter "was paid ${} dollars" into this box'
            ></textarea>
        </span>
        <div v-if="continuousSelected" class="continuous-container">
            <span class="name-input"
                ><input
                    @input="allowOnlyDecimals"
                    type="text"
                    v-model="decimals"
                    placeholder="Number of decimals to round to"
            /></span>
            <span class="min-max-container">
                <input
                    @input="allowOnlyDecimals"
                    v-model="minValue"
                    type="text"
                    placeholder="MIN"
                />
                <input
                    @input="allowOnlyDecimals"
                    v-model="maxValue"
                    type="text"
                    placeholder="MAX"
                />
            </span>
        </div>
        <ul v-else class="nominal-container">
            <li v-for="(nominalClass, index) in nominalClasses">
                <span class="class-container"
                    ><p>{{ nominalClass }}</p>
                    <button @click="nominalClasses.splice(index, 1)">
                        X
                    </button></span
                >
            </li>
            <input
                v-model="nominalInput"
                placeholder="Enter Class Name"
                style="margin-top: clamp(10px, 5vw, 20px)"
            />
        </ul>
        <span class="button-container"
            ><button
                v-if="!continuousSelected"
                class="add_class_button"
                @click="
                    {
                        nominalClasses.push(nominalInput);
                        nominalInput = '';
                    }
                "
            >
                Add Class</button
            ><button @click="submitNewAttribute">Submit</button>
            <p class="error-message">{{ errorMessage }}</p></span
        >
    </div>
</template>

<style scoped>
.error-message {
    color: rgba(196, 7, 7, 0.8);
}
span {
    display: flex;
    align-items: center;
}
.name-input {
    justify-content: center;
}
.class-container {
    display: flex;
    align-items: center;
}
.min-max-container {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    margin: 10px;
}
.nominal-container {
    list-style: none;
    margin: 20px 0 20px 0;
}
.nominal-container p {
    font-weight: 500;
    color: wheat;
    font-size: clamp(12px, 5vw, 20px);
    text-align: center;
    padding: 0 5px 0 5px;
    margin: 4px 0 4px 0;
    border: 2px solid rgba(80, 34, 1, 0.395);
    background: rgba(80, 34, 1, 0.395);
}
.nominal-container button {
    padding: 0 5px 0 5px;
    margin: 4px 0 4px 5px;
    background: rgba(196, 7, 7, 0.8);
    border: 2px solid rgba(84, 0, 0, 0.8);
}
.button-container {
    display: flex;
    justify-content: flex-start;
    width: 96%;
    margin: 10px;
    gap: 50px;
}
.attribute-type-options {
    position: relative;
    align-self: center;
    display: flex;
    margin: 5px;
    width: 96%;
    justify-content: center;
    border: 2px solid rgba(80, 34, 1, 0.395);
}
.attribute-type-options button {
    width: 50%;
    background-color: rgba(155, 65, 1, 0.395);
    border: none;
    position: relative;
    z-index: 1;
    justify-content: center;
    margin: 0;
}
.attribute-type-options .active:hover {
    cursor: default;
}
.attribute-type-options .overlay {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 50%;
    background-color: rgba(80, 34, 1, 0.395);
    transition: 0.2s ease;
}
.attribute-type-options .overlay.rightSide {
    position: absolute;
    top: 0;
    left: 50%;
    height: 100%;
    width: 50%;
    background-color: rgba(80, 34, 1, 0.395);
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
