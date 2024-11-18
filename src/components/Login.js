
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate,Link } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            // Store the JWT token
            localStorage.setItem('token', response.data.token);
            // Redirect to the home page or dashboard after login
            navigate('/');
        } catch (error) {
            setError('Invalid email or password');
            console.error("Error logging in", error);
        }
    };

    return (
        <div className="form-container">
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleLogin} className="form">
                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <label>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit" className="form-button">Login</button>
            </form>
            <p>
                If you're a new user, register here: <Link to="/register">Register</Link>
            </p>
        </div>
        
    );
}

export default Login;
