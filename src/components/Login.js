import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [validationError, setValidationError] = useState('');
    const navigate = useNavigate();

    const validateInputs = () => {
        // Check for valid email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setValidationError('Please enter a valid email address.');
            return false;
        }

        // Check for valid password
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            setValidationError(
                'Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.'
            );
            return false;
        }

        setValidationError(''); // Clear validation error if all checks pass
        return true;
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validateInputs()) {
            return; // Stop submission if validation fails
        }

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            // Store the JWT token
            localStorage.setItem('token', response.data.token);
            // Redirect to the home page or dashboard after login
            navigate('/');
        } catch (error) {
            setError('Invalid email or password');
            console.error('Error logging in', error);
        }
    };

    return (
        <div className="form-container">
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {validationError && <p style={{ color: 'orange' }}>{validationError}</p>} {/* Validation error */}
            <form onSubmit={handleLogin} className="form">
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                />
                <label>Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                />
                <button type="submit" className="form-button">Login</button>
            </form>
            <p>
                If you're a new user, register here: <Link to="/register">Register</Link>
            </p>
        </div>
    );
}

export default Login;
