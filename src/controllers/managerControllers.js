const path = require('path');
const bcrypt=require("bcryptjs")
const dotenv=require('dotenv').config()
const managerModel = require('../models/managerModel.js');


const login = async(req, res) => {
    try{
        if(req.body){
            const {email, password} = req.body;
            const user = await managerModel.findByEmail(email)
            if(user){
                const isMatch = await bcrypt.compare(password, user.password)
                if(!isMatch){
                    res.status(300).send({error: "Incorrect Password"})
                    return 0
                }
                
                res.status(201).send({success : "Login success", user : user})
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
        
        let user = new managerModel(req.body)
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





module.exports = {
    login,
    register,
}