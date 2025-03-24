@ -1,5 +1,7 @@
const mongoose = require("mongoose");
const bcrypt=require("bcryptjs")
const bcrypt=require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv =  require('dotenv').config();

const managerSchema = new mongoose.Schema({
    firstName: {
@ -23,24 +25,53 @@ const managerSchema = new mongoose.Schema({
    password: {
        type: String,
        required: true,
    },
    }, 
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"]
    },
}, { timestamps: true });


managerSchema.statics.findByEmail = async (email) => {
    const user = await managerModel.findOne({ email })
    if(!user){
        throw new Error("manager email not found");
managerSchema.statics.findByEmail = async function (email) {
    try {
 
      if (!email || typeof email !== 'string') {
        throw new Error('Invalid email provided');
      }

      const manager = await this.findOne({ email });
  
      if (!manager) {
        throw new Error('Manager email not found');
      }
  
      return manager;
    } catch (error) {
      console.error('Error in findByEmail:', error.message);
      throw error;
    }
    return user
};


managerSchema.methods.toJSON = function () {
  const user = this;
  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.token;
  return userObj;
}

managerSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.SECRET_TOKEN); 
  user.token = token; 
  await user.save();
  return token;
};


managerSchema.pre("save",async function (next) {
    const user =this
   if(user.isModified('password')){
