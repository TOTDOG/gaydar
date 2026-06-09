export async function logIn(password: string) {
    try {
        const response = await fetch("/api/adminLogin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ password: password }),
        });

        // Step B: Guarding Against Server Failures
        if (!response.ok) {
            throw new Error(`Server returned status: ${response.status}`);
        }
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}
export async function validateSession() {
    try {
        const response = await fetch("/api/validateSession", {
            method: "POST",
        });
        if (!response.ok) {
            throw new Error(`Server returned status: ${response.status}`);
        }
        return (await response.json()).valid;
    } catch (error) {
        console.error(error);
        return false;
    }
}
export async function logOut() {
    try {
        await fetch("/api/adminLogout", {
            method: "POST",
        });
    } catch (err) {
        console.error("Logout failed:", err);
    }
}
