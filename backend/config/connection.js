const mongoose = require("mongoose");
require('dotenv').config();

const mongoURI = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to MongoDB")
    } catch (err) {
        console.error("Connection Error: ", err.message);
        process.exit(1);
    }
}

module.exports = connectDB;