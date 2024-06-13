const fs = require("fs").promises;
const path = require("path");
const _ = require("lodash");

const updateParameters = async (req, res) => {
  const filePath = path.join(__dirname, "../models/parameters.json");
  const newParameters = req.body;

  try {
    const data = await fs.readFile(filePath, "utf8");
    let parameters;

    try {
      parameters = JSON.parse(data);
    } catch (parseErr) {
      return res.status(500).json({ message: "Error parsing JSON", error: parseErr });
    }

    const updatedParameters = _.merge(parameters, newParameters);

    await fs.writeFile(filePath, JSON.stringify(updatedParameters, null, 2), "utf8");

    res.status(200).json({ message: "Parameters updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error reading or writing file", error: err });
  }
};

module.exports = { updateParameters };
