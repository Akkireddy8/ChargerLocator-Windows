// Example URL
const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);

const role = params.get('role');
const token = params.get('token'); 

console.log('Role:', role);
console.log('Token:', token);

async function reset() {
    const btn = document.getElementById('resetBtn');
    btn.disabled = true;

    const newpassword = document.getElementById('newpassword').value.trim();
    const confirmpassword = document.getElementById('confirmpassword').value.trim();

    if (!newpassword || !confirmpassword) {
        alert("Please fill in all fields!");
        btn.disabled = false;
        return;
    }

    if (newpassword.length < 6) {
        alert("Password must be at least 6 characters long!");
        signupBtn.disabled = false;
        return;
    }

    if (newpassword !== confirmpassword) {
        alert("Passwords do not match!");
        btn.disabled = false;
        return;
    }

    try {
        const response = await fetch('/user/api/reset-password', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ role, token, newpassword })
        });

        const result = await response.json();

        if (response.ok) {
            alert("Password reset Successful!");
            console.log("Response:", result);
            window.location.href = "/index.html";
        } else {
            alert("Error: " + (result.error ));
        }
    } catch (error) {
        console.error("Reset Password Error:", error);
        alert("Something went wrong. Please try again.");
    } finally {
        btn.disabled = false;
    }
}
