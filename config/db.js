const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/db_studyflix");
        console.log("MongoDB Connected");
    } catch (e) {
        console.error("MongoDB connection failed:", e.message);
        process.exit(1); // Exit process on failure
    }
};

module.exports = connectDB;
