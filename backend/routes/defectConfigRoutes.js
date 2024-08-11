const express = require("express");
const router = express.Router();

const {updateDefectConfig, getDefectConfig} = require("../controllers/defectConfigsController");
const {auth} = require("../middlewares/auth");

router.get("/", auth, getDefectConfig);
router.post("/", auth, updateDefectConfig);

module.exports = router;
