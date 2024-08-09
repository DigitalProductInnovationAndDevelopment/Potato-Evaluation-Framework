const fs = require("fs").promises;
const path = require("path");

const ParametersSchema = require("../models/parameters");

// Define the path to your parameters.json file
const filePath = path.join(__dirname, "../models/parameters.json");

const updateParameters = async (req, res) => {
  const { preset_name, defekt_proportion_thresholds } = req.body;

  try {
    // Read the existing parameters from the file
    const data = await fs.readFile(filePath, "utf8");
    const parameters = JSON.parse(data);

    // Validate new parameters against schema
    if (!validateParameters(defekt_proportion_thresholds, ParametersSchema.thresholds)) {
      return res.status(400).json({ message: "Invalid parameters format or values out of range" });
    }

    // Check if preset is existing
    if (!parameters.parameters.hasOwnProperty(preset_name)) {
      return res.status(400).json({ message: "Preset is not found" });
    }

    // Update parameters for the given preset
    parameters.parameters[preset_name] = defekt_proportion_thresholds;

    // Write the updated parameters back to the file
    await fs.writeFile(filePath, JSON.stringify(parameters, null, 4), "utf8");

    res.status(200).json({ message: "Parameters updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error reading or writing file", error: err });
  }
};

const getParameters = async (req, res) => {
  try {
    // Read the existing parameters from the file
    const data = await fs.readFile(filePath, "utf8");
    const parameters = JSON.parse(data);
    res.status(200).json(parameters.parameters);
  } catch (err) {
    res.status(500).json({ message: "Error reading parameters file", error: err });
  }
};

const validateParameters = (params, schema) => {
  const validateObject = (obj, schema) => {
    return Object.keys(schema).every((key) => {
      const schemaItem = schema[key];
      if (typeof schemaItem === "object" && schemaItem.type) {
        const value = obj[key];
        const isValidType = typeof value === schemaItem.type;
        const isWithinRange = value >= schemaItem.min && value <= schemaItem.max;
        return isValidType && isWithinRange;
      } else if (typeof schemaItem === "object") {
        return validateObject(obj[key], schemaItem);
      } else {
        return false;
      }
    });
  };

  return validateObject(params, schema);
};

module.exports = { updateParameters, getParameters };
