const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv =  require('dotenv').config();

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"],
  },
  vehicleModel: {
    type: String,
    required: true,
    trim: true,
  },
  token: {
    type: String,
    required: false,
  },
}, { timestamps: true });


userSchema.statics.findByEmail = async (email) => {
  const user = await userModel.findOne({ email });
  if (!user) {
    throw new Error("User email not found");
  }
  return user;
};

userSchema.methods.toJSON = function () {
  const user = this;
  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.token;
  return userObj;
}

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.SECRET_TOKEN); 
  user.token = token; 
  await user.save();
  return token;
};

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

const userModel = mongoose.model("Users", userSchema);

module.exports = userModel;
