import React, { useState } from 'react';
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
 
function ForgotPassword() {
    
  const [email, setEmail] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isQuestionFetched, setIsQuestionFetched] = useState(false);
  const navigate = useNavigate();
 
  // Fetch security question based on the email
  const fetchSecurityQuestion = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/get-security-question",
        { email }
      );
      if (response.data.securityQuestion) {
        setSecurityQuestion(response.data.securityQuestion);
        setIsQuestionFetched(true);
        setError(""); // Clear previous error messages
      } else {
        setError("No security question found for this email.");
        setIsQuestionFetched(false);
      }
    } catch (err) {
      setError("Error fetching security question. Please try again.");
      setIsQuestionFetched(false);
    }
  };
 
  // Handle the password reset logic
  const handleForgotPassword = async (e) => {
    e.preventDefault();
 
    if (!isQuestionFetched) {
        setError('Please fetch the security question first.');
        return;
    }
 
    try {
        const response = await axios.post('http://localhost:5000/api/auth/reset-password', {
            email,
            securityAnswer,
            newPassword,
        });
 
        setMessage(response.data.message || 'Password reset successful!');
        navigate('/login');
        setError('');
    } catch (err) {
        if (err.response && err.response.data && err.response.data.error) {
            setError(err.response.data.error);
        } else {
            setError('Error resetting password. Please try again.');
        }
    }
};
 
  return (
<div className="form-container">
<h2>Forgot Password</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
<form onSubmit={handleForgotPassword} className="form">
<label>Email:</label>
<input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your registered email"
          required
        />
<button
          type="button"
          className="form-button"
          onClick={fetchSecurityQuestion}
>
          Fetch Security Question
</button>
 
        {isQuestionFetched && (
<>
<label>Security Question:</label>
<p style={{ fontStyle: "italic" }}>{securityQuestion}</p>
 
            <label>Answer to Security Question:</label>
<input
              type="text"
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
              placeholder="Enter your security answer"
              required
            />
 
            <label>New Password:</label>
<input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your new password"
              required
            />
<button type="submit" className="form-button">
              Reset Password
</button>
</>
        )}
</form>
</div>
  );
}
 
export default ForgotPassword;