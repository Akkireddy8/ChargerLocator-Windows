const path = require('path');
const bcrypt=require("bcryptjs")
const crypto = require('crypto');
const dotenv=require('dotenv').config()
const userModel = require('../models/userModel.js');
const managerModel = require('../models/managerModel.js');
const Emails = require('../emails.js');
const jwt = require('jsonwebtoken');


const login = async(req, res) => {
    try{
        if(req.body){
            const {email, password} = req.body;
            const user = await userModel.findByEmail(email)
            if(user){
                const isMatch = await bcrypt.compare(password, user.password)
                if(!isMatch){
                    res.status(300).send({error: "Incorrect Password"})
                    return 0
                }
                const token = await user.generateAuthToken();
                
                res.status(201).send({success : "Login success", user : user.toJSON(), token: token})
                return 0
            }
            res.status(404).send({error : "Incorrect Email"})
        }
    } catch (err) {
        console.log("Error in while login : ",err)
        res.status(500).send({error : "Something went wrong in server!"})
    }
}


const register = async(req,res) => {
  // //  console.log(req.body)
    try{
        if(!req.body){
            console.log('Error in creating user account')
            res.status(500).send({error: "Something went wrong in server!"})
            return 0
        }
        
        let user = new userModel(req.body)
        await user.save()
        
        if(user){
            console.log("User account created successfully!")
            res.status(201).send({success : "Registered Successfully!"})
            return 0
        }
        console.log("Error while creating account")
    } catch (err) {
        console.log("Error in while creating account : ",err)
        res.status(500).send({error : "Something went wrong in server!"})
    }
}


const resetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const { role } = req.params;

        let user, path
        if(role == "User"){
            user = await userModel.findOne({ email });
            path = ""
        } 
        else{
            user = await managerModel.findOne({ email });
            path = "manager"
        } 
        if (!user) {
            return res.status(404).send({ error: "User not found!" });
        }

        const resetToken = jwt.sign({ id: user._id }, process.env.SECRET_TOKEN, { expiresIn: '30m' });

        const resetURL = `${req.protocol}://${req.get('host')}/${path}/changePassword.html?role=${role}&token=${resetToken}`;

        await Emails.sendPasswordResetEmail(email, resetURL);

        res.status(200).send({ message: "Password reset link sent to your email." });
    } catch (error) {
        console.error("Error in reset password:", error);
        res.status(500).send({ error: "Something went wrong on the server!" });
    }
};


const confirmResetPassword = async (req, res) => {
    try {

        const { newPassword, token, role } = req.body;

        const decoded = jwt.verify(token, process.env.SECRET_TOKEN);

        let user
        if(role == "User") user = await userModel.findById(decoded.id);
        else user = await managerModel.findById(decoded.id);
        if (!user) {
            return res.status(404).send({ error: "User not found!" });
        }
   
       // const hashedPassword = await bcrypt.hash(newPassword, 12);

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
}