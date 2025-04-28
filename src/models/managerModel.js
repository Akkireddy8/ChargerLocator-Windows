const mongoose = require("mongoose");
const bcrypt=require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv =  require('dotenv').config();

const managerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
    },
    password: {
        type: String,
        required: true,
    }, 
    phoneNumber: {
        type: String,
        required: true,
        match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"]
    },
}, { timestamps: true });


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
       user.password = await bcrypt.hash(user.password, 10);
   }
    next();
})

const managerModel = mongoose.model('Manager',managerSchema)

module.exports=managerModel
