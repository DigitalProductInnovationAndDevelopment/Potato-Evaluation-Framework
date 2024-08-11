const TrackingHistoryModel = require("../models/TrackingHistory");

const createTrackingHistory = async (req, res) => {
    const newModel = new TrackingHistoryModel(req.body);
    try {
        await newModel.save();
        res.status(201).json(newModel);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getLatestTrackingHistory = async (req, res) => {
    try {
        const models = await TrackingHistoryModel.find().sort('-trackingDate').limit(1);
        res.status(200).json(models);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    createTrackingHistory,
    getLatestTrackingHistory
};