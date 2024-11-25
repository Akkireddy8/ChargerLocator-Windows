import React, { useState } from 'react';  // Import React and useState for state management
import axios from 'axios';  // Import axios for making HTTP requests
import { useNavigate, Link } from 'react-router-dom';  // Import useNavigate for navigation and Link for routing

function Login() {
    // State variables to manage form input values and error messages
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');  // Error message for login failure
    const [validationError, setValidationError] = useState('');  // Error message for validation failure
    const navigate = useNavigate();  // useNavigate hook to redirect after successful login

    // Function to validate email and password input fields
    const validateInputs = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  // Regular expression to check valid email
        if (!emailRegex.test(email)) {
            setValidationError('Please enter a valid email address.');  // Set validation error if email is invalid
            return false;
        }

        // Regular expression to check for strong password criteria
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            setValidationError(
                'Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.'
            );  // Set validation error if password doesn't meet the requirements
            return false;
        }

        setValidationError('');  // Clear any validation error if inputs are valid
        return true;
    };

    // Handle login form submission
    const handleLogin = async (e) => {
        e.preventDefault();  // Prevent form default submission behavior

        // Check if inputs are valid before proceeding with login request
        if (!validateInputs()) {
            return;  // Stop execution if validation fails
        }

        try {
            // Make a POST request to the server for user authentication
            const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            
            // If login is successful and the response contains a token, save it in localStorage
            if (response.data && response.data.token) {
                localStorage.setItem('token', response.data.token);  // Store token in localStorage
                setError('');  // Clear any previous error messages
                navigate('/');  // Redirect to home page after successful login
            } else {
                setError('Login failed. Please try again.');  // Set error message if no token is received
            }
        } catch (error) {
            // Handle any errors that occur during the login request
            if (error.response && error.response.data && error.response.data.error) {
                setError(error.response.data.error);  // Set specific error message from response if available
            } else {
                setError('An unexpected error occurred. Please try again.');  // Set a generic error message
            }
            console.error('Error logging in:', error);  // Log the error for debugging
        }
    };

    return (
        <div className="form-container">
            <h2>Login</h2>
            {/* Display error messages if any */}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {validationError && <p style={{ color: 'orange' }}>{validationError}</p>}
            {/* Login form */}
            <form onSubmit={handleLogin} className="form">
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}  // Update email state when input changes
                    placeholder="Enter your email"
                    required  // Ensure the field is not empty
                />
                <label>Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}  // Update password state when input changes
                    placeholder="Enter your password"
                    required  // Ensure the field is not empty
                />
                <button type="submit" className="form-button">Login</button>
            </form>
            {/* Links for additional actions */}
            <p>
                <Link to="/forgot-password">Forgot Password?</Link>
            </p>
            <p>
                If you're a new user, register here: <Link to="/register">Register</Link>
            </p>
        </div>
    );
}

export default Login;
