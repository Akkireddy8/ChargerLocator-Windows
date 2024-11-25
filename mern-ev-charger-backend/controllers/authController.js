const bcrypt = require('bcryptjs');  // Import bcrypt for hashing and comparing passwords
const jwt = require('jsonwebtoken');  // Import jsonwebtoken for creating JWT tokens
const User = require('../models/User');  // Import the User model for database operations
 
// Register function to handle user registration
exports.register = async (req, res) => {
    const { email, password } = req.body;  // Destructure email and password from the request body
    try {
        // Hash the password before saving it to the database
        const hashedPassword = await bcrypt.hash(password, 10);
 
        // Create a new user with the hashed password
        const newUser = await User.create({ email, password: hashedPassword });
 
        // Send a success response if the user is created
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        // If an error occurs, return a 500 status with an error message
        res.status(500).json({ error: "User registration failed" });
    }
};
 
// Login function to handle user authentication
exports.login = async (req, res) => {
    const { email, password } = req.body;  // Destructure email and password from the request body
    try {
        // Find the user by email in the database
        const user = await User.findOne({ email });
 
        // If user is not found, return a 404 status with an error message
        if (!user) return res.status(404).json({ error: "User not found" });
 
        // Compare the entered password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
 
        // If the passwords don't match, return a 401 status with an error message
        if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });
 
        // If the login is successful, create a JWT token with the user's ID
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
 
        // Send the token in the response
        res.json({ token });
    } catch (error) {
        // If an error occurs during login, return a 500 status with an error message
        res.status(500).json({ error: "Login failed" });
    }
};
