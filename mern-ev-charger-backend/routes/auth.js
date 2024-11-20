const express = require('express');
const bcrypt = require('bcryptjs'); // For password comparison
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming User is your Mongoose model
const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Compare the hashed password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET, // Replace with your secret key
            { expiresIn: '1h' } // Token expiration time
        );

        // Send the token to the client
        res.json({ token, message: 'Login successful!' });
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
