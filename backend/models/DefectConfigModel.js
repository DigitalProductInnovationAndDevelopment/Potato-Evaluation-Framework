const mongoose = require('mongoose');


const defectConfigSchema = new mongoose.Schema({
    greening:  {
        type: Number,
        min: 0,
        max: 1,
    },
    dryRot:  {
        type: Number,
        min: 0,
        max: 1,
        default: 0.2,
    },
    wetRot:  {
        type: Number,
        min: 0,
        max: 1,
        default: 0.3
    },
    wireWorm: {
        type: Number,
        min: 0,
        max: 1,
        default: 0.4
    },
    malformed: {
        type: Number,
        min: 0,
        max: 1,
        default: 0.5
    },
    growthCrack: {
        type: Number,
        min: 0,
        max: 1,
        default: 0.6
    },
    mechanicalDamage: {
        type: Number,
        min: 0,
        max: 1,
        default: 0.8
    },
    dirtClod: {
        type: Number,
        min: 0,
        max: 1,
        default: 0.2
    },
    stone: {
        type: Number,
        min: 0,
        max: 1,
        default: 0.3
    },
});


const DefectConfigModel = mongoose.model('DefectConfig', defectConfigSchema);

module.exports = DefectConfigModel;
