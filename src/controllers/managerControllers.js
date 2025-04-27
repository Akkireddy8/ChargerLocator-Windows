const path = require('path');
const bcrypt=require("bcryptjs")
const dotenv=require('dotenv').config()
const managerModel = require('../models/managerModel.js');
const userModel = require('../models/userModel.js');
const Station = require('../models/stationModel.js');
const Payment = require('../models/paymentModel.js');
const Message = require('../models/messageModel.js')

const login = async (req, res) => {
    try {
        if (req.body) {
            const { email, password } = req.body;
            const user = await managerModel.findByEmail(email);

            if (user) {
                const isMatch = await bcrypt.compare(password, user.password);

                if (!isMatch) {
                    res.status(400).send({ error: "Incorrect Password" });
                    return;
                }

                const token = await user.generateAuthToken();

                res.status(200).send({ 
                    success: "Login success", 
                    user: user.toJSON(), 
                    token: token 
                });
                return;
            }

            res.status(404).send({ error: "Email account not registered" });
        }
    } catch (error) {

        if (error.message === 'Manager email not found') {
            res.status(404).send({ error: "Manager email not found" });
        } else {
            console.error("Error during login:", error);
            res.status(500).send({ error: "Internal Server Error" });
        }
    }
};



const register = async(req,res) => {
  // //  console.log(req.body)
    try{
        if(!req.body){
            console.log('Error in creating user account')
            res.status(500).send({error: "Something went wrong in server!"})
            return 0
        }

        let checkMail = await managerModel.findOne({email: req.body.email});
        if(checkMail){
            return res.status(300).send({error: "Email already registered"});
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

const getUsers = async (req, res) => {
    try {

        const latestMessages = await Message.aggregate([
            { $match: { senderType: 'user' } },
            { $sort: { timestamp: -1 } },
            { $group: { 
                _id: "$senderId",
                latestMessageTimestamp: { $first: "$timestamp" }
            }}
        ]);
        
        const userIds = latestMessages.map(msg => msg._id);
        
        let users = await userModel.find({ _id: { $in: userIds } });
        
        users = users.sort((a, b) => {
            const timestampA = latestMessages.find(msg => msg._id.equals(a._id))?.latestMessageTimestamp || 0;
            const timestampB = latestMessages.find(msg => msg._id.equals(b._id))?.latestMessageTimestamp || 0;
            return new Date(timestampB) - new Date(timestampA);
        });

        res.json({ users });
    } catch (error) {
        console.error("Error while fetching user accounts: ", error);
        res.status(500).send({ error: "Error while fetching user accounts!" });
    }
};

const stationRevenue = async (req, res) => {
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const revenueData = await Payment.aggregate([
            {
                $match: {
                    paymentTime: { $gte: startOfMonth }
                }
            },
            {
                $group: {
                    _id: "$stationId",
                    totalIncome: { $sum: "$price" },
                    totalEnergy: { $sum: "$energyConsumed" },
                    transactions: { $sum: 1 }
                }
            },
            {
                $sort: { totalIncome: -1 }
            }
        ]);

        res.status(200).json(revenueData);
    } catch (err) {
        console.error("Error fetching revenue data:", err);
        res.status(500).json({ message: "Server error" });
    }
};


module.exports = {
    login,
    register,
    getUsers,
    stationRevenue
}