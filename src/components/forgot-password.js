import React, { useState } from 'react';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleForgotPassword = (e) => {
        e.preventDefault();
        // Simulate a password reset email being sent
        setMessage(`Password reset instructions sent to ${email}.`);
    };

    return (
        <div className="form-container">
            <h2>Forgot Password</h2>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            <form onSubmit={handleForgotPassword} className="form">
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    required
                />
                <button type="submit" className="form-button">Send Reset Instructions</button>
            </form>
        </div>
    );
}

export default ForgotPassword;
