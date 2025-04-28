async function signup() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const signupBtn = document.getElementById('signupBtn');

    signupBtn.disabled = true;

    if (!firstName || !lastName || !email || !password || !confirmPassword || !phone ) {
        alert("All fields are required!");
        signupBtn.disabled = false;
        return;
    }

    const emailPattern = /^\S+@\S+\.com$/;
    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address (must contain '@' and end with '.com')!");
        signupBtn.disabled = false;
        return;
    }

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\d\s])(?=.{8,})/;
    if (!passwordPattern.test(password)) {
        alert("Password must be at least 8 characters long and include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character!");
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
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        phoneNumber: phone,
    };

    try {
        const response = await fetch('/manager/api/register', {
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
            window.location.href = "/manager/index.html";
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
