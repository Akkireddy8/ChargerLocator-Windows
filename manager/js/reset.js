document.getElementById("resetForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const btn = document.getElementById("resetBtn");
    btn.disabled = true;

    const email = document.getElementById("email").value.trim();

    if (!email) {
        alert("Please enter a valid email.");
        btn.disabled = false;
        return;
    }

    try {
        const response = await fetch("/user/api/request-reset-password/Manager", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: email })
        });

        const result = await response.json();

        if (response.ok) {
            alert("Mail sent successfully!");
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
