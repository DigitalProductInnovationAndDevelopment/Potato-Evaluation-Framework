const express = require("express");
const router = express.Router();

const {updateParameters, getParameters} = require("./../controllers/parameterControllers");

router.post("/update", updateParameters);
router.get("/", getParameters);

module.exports = router;
