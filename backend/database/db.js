const mongoose = require("mongoose");
require("dotenv").config();

const mongoURI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected successfully to the database");
  } catch (error) {
    console.error("Error connecting to the database", error.message);
  }
};

module.exports = connectDB;
