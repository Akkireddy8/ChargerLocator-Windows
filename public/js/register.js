async function signup() {
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const vehicleModel = document.getElementById('vehicleModel').value.trim();
    const signupBtn = document.getElementById('signupBtn');

    signupBtn.disabled = true;

    if (!email || !password || !confirmPassword || !phone || !vehicleModel) {
        alert("All fields are required!");
        signupBtn.disabled = false;
        return;
    }

    const emailPattern = /^\S+@\S+\.\S+$/;
    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address!");
        signupBtn.disabled = false;
        return;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters long!");
        signupBtn.disabled = false;
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        signupBtn.disabled = false;
        return;
    }

    const phonePattern = /^\d{10}$/;
    if (!phonePattern.test(phone)) {
        alert("Please enter a valid 10-digit phone number!");
        signupBtn.disabled = false;
        return;
    }

    const requestBody = {
        email,
        password,
        confirmPassword,
        phoneNumber: phone,
        vehicleModel
    };

    try {
        const response = await fetch('/user/api/register', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        });

        const result = await response.json();

        if (response.ok) {
            alert("Registration Successful!");
            console.log("Response:", result);
            window.location.href = "/index.html";
        } else {
            alert("Error: " + (result.error || "Registration failed!"));
        }
    } catch (error) {
        console.error("Registration Error:", error);
        alert("Something went wrong. Please try again.");
    } finally {
        signupBtn.disabled = false;
    }
}
