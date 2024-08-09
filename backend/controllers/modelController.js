const DetectionModel = require("../models/DetectionModel");

const getAllModels = async (req, res) => {
  try {
    const models = await DetectionModel.find();
    res.status(200).json(models);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addModel = async (req, res) => {
  const { name, description } = req.body;
  const newModel = new DetectionModel({ name, description });

  try {
    await newModel.save();
    res.status(201).json(newModel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteModel = async (req, res) => {
  const { id } = req.params;

  try {
    await DetectionModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Model deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const setCurrentModel = async (req, res) => {
  const { id } = req.params;

  try {
    await DetectionModel.updateMany({}, { isCurrent: false });
    const currentModel = await DetectionModel.findByIdAndUpdate(id, { isCurrent: true }, { new: true });
    res.status(200).json(currentModel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllModels,
  addModel,
  deleteModel,
  setCurrentModel
};
