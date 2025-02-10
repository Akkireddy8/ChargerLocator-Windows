const mongoose = require('mongoose');
const dotenv=require('dotenv').config()
const connectionString = process.env.MONGO_DB_URL
console.log(connectionString)

const connectDb = async () => {
    try {
        const { connection } = await mongoose.connect(connectionString);
        console.log(`DB Connected : ${connection.name}`);
    } catch (err) {
        console.error("Database connection error:", err);
    }
};

module.exports = connectDb;