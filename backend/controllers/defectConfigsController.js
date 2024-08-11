const DefectConfigModel = require("../models/DefectConfigModel");


const getDefectConfig = async (req, res) => {
    try {
        const defectConfig = await DefectConfigModel.findOne().exec();
        res.status(200).json(defectConfig);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateDefectConfig = async (req, res) => {
    try {
        const updateData = req.body;

        const defectConfig = await DefectConfigModel.findOne();

        if (!defectConfig) {
            return res.status(404).json({ message: 'Defect configuration not found' });
        }

        // Update fields
        Object.keys(updateData).forEach((key) => {
            if (defectConfig[key] !== undefined) {
                defectConfig[key] = updateData[key];
            }
        });
        await defectConfig.save();

        return res.status(200).json({
            message: 'Defect configuration updated successfully',
            data: defectConfig,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error updating defect configuration',
            error: error.message,
        });
    }
};

module.exports = {
    getDefectConfig,
    updateDefectConfig,
};