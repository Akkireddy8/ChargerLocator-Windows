
const bcrypt = require('bcryptjs'); // For hashing passwords and security answers
const jwt = require('jsonwebtoken'); // For creating JWT tokens
const User = require('../models/User'); // User model for database operations
 
// Register function: handle user registration
exports.register = async (req, res) => {
   
    const { email, password, securityQuestion, securityAnswer } = req.body; // Destructure fields from request
    try {
      
        // Hash password and security answer before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create a new user with the hashed password
        
        // Send a success response if the user is created
        const hashedSecurityAnswer = await bcrypt.hash(securityAnswer, 10);
 
        // Create new user
        const newUser = await User.create({
            email,
            password: hashedPassword,
            securityQuestion,
            securityAnswer: hashedSecurityAnswer,
        });
 
        // Success response
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        // If an error occurs, return a 500 status with an error message
        // Handle duplicate email error
        if (error.code === 11000) {
            return res.status(400).json({ error: "Email is already registered" });
        }
        // Generic error response
        res.status(500).json({ error: "User registration failed" });
    }
};
 
// Login function: handle user authentication
exports.login = async (req, res) => {
    
    const { email, password } = req.body; // Destructure email and password
    try {
        
        // Find user by email
        const user = await User.findOne({ email });
        // If user is not found, return a 404 status with an error message
        if (!user) return res.status(404).json({ error: "User not found" });
       
        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        // If the passwords don't match, return a 401 status with an error message
        if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });
        // If the login is successful, create a JWT token with the user's ID
        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" }); 
        // Respond with token
        res.json({ token });
    } catch (error) {
        // If an error occurs during login, return a 500 status with an error message
        res.status(500).json({ error: "Login failed" });
    }
};
 
// Verify security answer function: validate user during password reset
exports.verifySecurityAnswer = async (req, res) => {
    const { email, securityAnswer } = req.body; // Destructure email and security answer
    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });
 
        // Compare provided answer with stored hashed answer
        const isAnswerCorrect = await bcrypt.compare(securityAnswer, user.securityAnswer);
        if (!isAnswerCorrect) {
            return res.status(401).json({ error: "Incorrect security answer" });
        }
 
        // Success response
        res.status(200).json({ message: "Security answer verified. You can reset your password." });
    } catch (error) {
        res.status(500).json({ error: "Verification failed" });
    }
};
 
// Reset password function: allow user to update their password
exports.resetPassword = async (req, res) => {
    const { email, securityAnswer,newPassword  } = req.body;
    console.log(req.body); // Log the request body
 
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
 
        const isAnswerCorrect = await bcrypt.compare(securityAnswer, user.securityAnswer);
        if (!isAnswerCorrect) {
            return res.status(401).json({ error: "Incorrect security answer" });
        }
 
        if (newPassword.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long" });
        }
 
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updatedUser = await User.findOneAndUpdate({ email }, { password: hashedPassword }, { new: true });
 
        res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: "Password reset failed" });
    }
};
 
 
exports.getSecurityQuestion = async (req, res) => {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }
      res.status(200).json({ securityQuestion: user.securityQuestion });
    } catch (error) {
      res.status(500).json({ error: "Error fetching security question." });
    }
  };