const express = require("express");
const router = express.Router();
const { auth } = require('../middlewares/auth');
const {updateParameters, getParameters} = require("../controllers/parametersController");

router.post("/update",auth, updateParameters);
router.get("/", auth, getParameters);

module.exports = router;
