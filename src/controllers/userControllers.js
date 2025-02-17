const path = require('path');
const bcrypt = require("bcryptjs");
const crypto = require('crypto');
const dotenv = require('dotenv').config();
const userModel = require('../models/userModel.js');
const managerModel = require('../models/managerModel.js');
const Emails = require('../emails.js');
const jwt = require('jsonwebtoken');

// Login function
const login = async (req, res) => {
    try {
        if (req.body) {
            const { email, password } = req.body;
            const user = await userModel.findByEmail(email); // Find user by email
            
            if (user) {
                const isMatch = await bcrypt.compare(password, user.password); // Compare passwords
                if (!isMatch) {
                    res.status(300).send({ error: "Incorrect Password" });
                    return;
                }
                
                const token = await user.generateAuthToken(); // Generate authentication token
                res.status(201).send({ success: "Login success", user: user.toJSON(), token: token });
                return;
            }
            res.status(404).send({ error: "Incorrect Email" }); // User not found
        }
    } catch (err) {
        console.log("Error in while login : ", err);
        res.status(500).send({ error: "Something went wrong in server!" });
    }
};

// Register function
const register = async (req, res) => {
    try {
        if (!req.body) {
            console.log('Error in creating user account');
            res.status(500).send({ error: "Something went wrong in server!" });
            return;
        }
        
        let user = new userModel(req.body); // Create a new user
        await user.save(); // Save user to database
        
        if (user) {
            console.log("User account created successfully!");
            res.status(201).send({ success: "Registered Successfully!" });
            return;
        }
        console.log("Error while creating account");
    } catch (err) {
        console.log("Error in while creating account : ", err);
        res.status(500).send({ error: "Something went wrong in server!" });
    }
};

// Reset password function
const resetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const { role } = req.params;

        let user, path;
        
        if (role == "User") {
            user = await userModel.findOne({ email }); // Find user by email
            path = "";
        } else {
            user = await managerModel.findOne({ email }); // Find manager by email
            path = "manager";
        }
        
        if (!user) {
            return res.status(404).send({ error: "User not found!" });
        }

        // Generate password reset token
        const resetToken = jwt.sign({ id: user._id }, process.env.SECRET_TOKEN, { expiresIn: '30m' });

        // Generate reset URL
        const resetURL = `${req.protocol}://${req.get('host')}/${path}/changePassword.html?role=${role}&token=${resetToken}`;

        // Send reset email
        await Emails.sendPasswordResetEmail(email, resetURL);

        res.status(200).send({ message: "Password reset link sent to your email." });
    } catch (error) {
        console.error("Error in reset password:", error);
        res.status(500).send({ error: "Something went wrong on the server!" });
    }
};

// Confirm reset password function
const confirmResetPassword = async (req, res) => {
    try {
        const { newPassword, token, role } = req.body;

        // Verify the reset token
        const decoded = jwt.verify(token, process.env.SECRET_TOKEN);

        let user;
        if (role == "User") user = await userModel.findById(decoded.id);
        else user = await managerModel.findById(decoded.id);
        
        if (!user) {
            return res.status(404).send({ error: "User not found!" });
        }
   
        // Update the user's password
        user.password = newPassword;
        await user.save();

        res.status(200).send({ message: "Password has been successfully updated." });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(400).send({ error: "Reset link has expired. Please request a new one." });
        }
        
        console.error("Error in confirming reset password:", error);
        res.status(500).send({ error: "Something went wrong on the server!" });
    }
};

module.exports = {
    login,
    register,
    resetPassword,
    confirmResetPassword
};
