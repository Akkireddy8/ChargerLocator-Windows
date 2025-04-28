
const urlParams = new URLSearchParams(window.location.search);
const role = urlParams.get("role");
const token = urlParams.get("token");

console.log("Role:", role);
console.log("Token:", token);

document.getElementById("resetForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const btn = document.getElementById("resetBtn");
    btn.disabled = true;

    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    if (!password || !confirmPassword) {
        alert("Please fill in all fields!");
        btn.disabled = false;
        return;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters long!");
        btn.disabled = false;
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        btn.disabled = false;
        return;
    }

    try {
        const response = await fetch("/user/api/reset-password", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ role, token, newPassword: password })
        });

        const result = await response.json();

        if (response.ok) {
            alert("Password reset successful!");
            console.log("Response:", result);
            window.location.href = "/manager/index.html";
        } else {
            alert("Error: " + (result.error || "Unknown error"));
        }
    } catch (error) {
        console.error("Reset Password Error:", error);
        alert("Something went wrong. Please try again.");
    } finally {
        btn.disabled = false;
    }
});
