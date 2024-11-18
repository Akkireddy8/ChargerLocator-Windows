function handleLogin(event) {
    event.preventDefault(); // Prevent form submission

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const rememberMe = document.getElementById("rememberMe").checked;

    // Sample client-side validation (real authentication is handled server-side)
    if (email && password) {
        console.log("Email:", email);
        console.log("Password:", password);
        console.log("Remember Me:", rememberMe);

        // Placeholder for actual login functionality, such as sending data to the backend
        alert("Login successful!");

        // Redirect or perform further actions
    } else {
        alert("Please fill in both email and password.");
    }
}
