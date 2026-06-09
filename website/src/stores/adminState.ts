import { ref } from "vue";
import { validateSession } from "../services/adminLoginServices.js";

export const hasAdminPrivledges = ref(false);

export const isLoading = ref(true); // Track status so components know it's pending

export async function loadAdminPrivledges() {
    try {
        hasAdminPrivledges.value = await validateSession();
    } catch (error) {
        console.error("Failed to load initial data:", error);
    } finally {
        isLoading.value = false; // Updates globally instantly
    }
}
