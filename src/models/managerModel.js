const mongoose = require("mongoose");
const bcrypt=require("bcryptjs")

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
        unique: true,
        match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"]
    },
}, { timestamps: true });


managerSchema.statics.findByEmail = async (email) => {
    const user = await managerModel.findOne({ email })
    if(!user){
        throw new Error("manager email not found");
    }
    return user
}

managerSchema.pre("save",async function (next) {
    const user =this
   if(user.isModified('password')){
       user.password = await bcrypt.hash(user.password, 10);
   }
    next();
})

const managerModel = mongoose.model('Manager',managerSchema)

module.exports=managerModel
