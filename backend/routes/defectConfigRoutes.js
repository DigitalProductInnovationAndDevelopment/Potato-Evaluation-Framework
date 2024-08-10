const express = require("express");
const router = express.Router();

const {updateDefectConfig, getDefectConfig} = require("../controllers/defectConfigsController");

router.get("/", getDefectConfig);
router.post("/", updateDefectConfig);

module.exports = router;
