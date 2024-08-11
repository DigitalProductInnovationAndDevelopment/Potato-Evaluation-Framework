const mongoose = require("mongoose");
const User = require("../models/User");
const DefectConfig = require("../models/DefectConfigModel");
const DetectionModel = require("../models/DetectionModel");
const TrackingHistoryModel = require("../models/TrackingHistory");
require("dotenv").config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Seed initial users
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

    // Check and seed the default defect config
    const defectConfig = await DefectConfig.findOne();

    if (!defectConfig) {
      await DefectConfig.create({});
      console.log("Default defect config created with default values.");
    } else {
      console.log("Default defect config already exists.");
    }

    const trackingHistoryExist = await TrackingHistoryModel.findOne();
    if (!trackingHistoryExist) {
      await TrackingHistoryModel.create({
        goodPotatoes: 671,
        badPotatoes: 329,
        greening: 43,
        dryRot: 42,
        wetRot: 35,
        wireWorm: 37,
        malformed: 51,
        growthCrack: 29,
        mechanicalDamage: 26,
        dirtClod: 30,
        stone: 36,
        trackingDate: Date.now(),
      });
      console.log("Tracking history created.");
    } else {
      console.log("Tracking history already exists.");
    }

  } catch (err) {
    console.log(err);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();
