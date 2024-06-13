const express = require("express");
const router = express.Router();

const {updateParameters} = require("./../controllers/parameterControllers");

router.post("/update", updateParameters);

module.exports = router;
