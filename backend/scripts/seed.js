const mongoose = require("mongoose");
const User = require("../models/User");
const process = require('process')
const DetectionModel = require("../models/DetectionModel");
require("dotenv").config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    //seed initial users
    const admin = await User.findOne({ isAdmin: true });
    const client = await User.findOne({ isAdmin: false });

    if (!client) {
      await User.create({
        email: "client@example.com",
        password: "client1234",
        isAdmin: false,
      });
      console.log("Client user created");
    } else {
      console.log("Client user already exists");
    }

    if (!admin) {
      await User.create({
        email: "admin@example.com",
        password: "admin1234",
        isAdmin: true,
      });
      console.log("Admin user created");
    } else {
      console.log("Admin user already exists");
    }

    // Seed initial models
    const model1 = await DetectionModel.findOne({ name: "Model 1 Grading" });
    const model2 = await DetectionModel.findOne({ name: "Model 2 Unloading" });

    if (!model1) {
      await DetectionModel.create({
        name: "Model 1 Grading",
        description: "Description of Model 1",
        isCurrent: false,
      });
      console.log("Model 1 Grading created");
    } else {
      console.log("Model 1 Grading already exists");
    }

    if (!model2) {
      await DetectionModel.create({
        name: "Model 2 Unloading",
        description: "Description of Model 2",
        isCurrent: false,
      });
      console.log("Model 2 Unloading created");
    } else {
      console.log("Model 2 Unloading already exists");
    }
  } catch (err) {
    console.log(err);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();
