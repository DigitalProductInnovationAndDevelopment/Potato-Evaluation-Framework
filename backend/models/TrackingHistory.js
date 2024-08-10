const mongoose = require('mongoose');

const trackingHistorySchema = new mongoose.Schema({
    goodPotatoes: Number,
    badPotatoes: Number,
    greening: Number,
    dryRot: Number,
    wetRot: Number,
    wireWorm: Number,
    malformed: Number,
    growthCrack: Number,
    mechanicalDamage: Number,
    dirtClod: Number,
    stone: Number,
    trackingDate: Date,
});


const TrackingHistoryModel = mongoose.model('TrackingHistory', trackingHistorySchema);

module.exports = TrackingHistoryModel;
