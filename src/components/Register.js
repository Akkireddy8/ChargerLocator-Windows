import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [securityQuestion, setSecurityQuestion] = useState('');
    const [securityAnswer, setSecurityAnswer] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const validateInputs = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address.');
            return false;
        }

        if (!passwordRegex.test(password)) {
            setError(
                'Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.'
            );
            return false;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match!');
            return false;
        }

        if (!securityQuestion) {
            setError('Please select a security question.');
            return false;
        }

        if (!securityAnswer) {
            setError('Please provide an answer to the security question.');
            return false;
        }

        setError('');
        return true;
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!validateInputs()) return;

        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', {
                email,
                password,
                securityQuestion,
                securityAnswer,
            });

            setSuccess(response.data.message || 'Registration successful! Redirecting to login...');
            setError('');

            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError('Error registering user. Please try again.');
            }
        }
    };

    return (
        <div className="form-container">
            <h2>Register</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <form onSubmit={handleRegister} className="form">
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
                <label>Confirm Password:</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    required
                />
                <label>Security Question:</label>
                <select
                    value={securityQuestion}
                    onChange={(e) => setSecurityQuestion(e.target.value)}
                    required
                >
                    <option value="">-- Select a Question --</option>
                    <option value="What is your first pet's name?">
                        What is your first pet's name?
                    </option>
                    <option value="What is your favorite sport?">
                        What is your favorite sport?
                    </option>
                    <option value="What is the name of your first school?">
                        What is the name of your first school?
                    </option>
                </select>
                <label>Answer:</label>
                <input
                    type="text"
                    value={securityAnswer}
                    onChange={(e) => setSecurityAnswer(e.target.value)}
                    placeholder="Enter your answer"
                    required
                />
                <button type="submit" className="form-button">
                    Register
                </button>
            </form>
        </div>
    );
}

export default Register;
