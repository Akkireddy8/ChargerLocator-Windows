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
        const response = await fetch('/user/api/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: email, password: password })
        });

        const result = await response.json();
        console.log(response, result)
        if (response.ok) {
            alert("Login Successful!");
            console.log("Response:", result);
           // localStorage.setItem('user', JSON.stringify(result));
            localStorage.setItem('token', result.token);
            localStorage.setItem('userId', result.user._id);
            localStorage.setItem('email', email);
            const adapterTypes = result.user.vehicles.flatMap(vehicle => vehicle.adapterTypes);
            localStorage.setItem('adapters', JSON.stringify(adapterTypes));
            window.location.href = "/dashboard.html";
        } else {
            alert("Error: " + (result.error));
        }
    } catch (error) {
        console.error("Login Error:", error);
        alert("Something went wrong. Please try again.");
    } finally {
        btn.disabled = false;
    }
}
