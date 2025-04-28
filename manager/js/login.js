async function login() {
    const btn = document.getElementById('loginBtn');
    btn.disabled = true;

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email || !password) {
        alert("Please fill in all fields!");
        btn.disabled = false;
        return;
    }

    try {
        const response = await fetch('/manager/api/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: email, password: password })
        });

        const result = await response.json();
        console.log(result)
        if (response.ok) {
            alert("Login Successful!");
            console.log("Response:", result);
            localStorage.setItem('managerId', result.user._id)
            window.location.href = "/manager/dashboard.html";
        } else {
            alert("Error: " + (result.error || "Login failed!"));
        }
    } catch (error) {
        console.error("Login Error:", error);
        alert("Something went wrong. Please try again.");
    } finally {
        btn.disabled = false;
    }
}
