const express = require("express");
const router = express.Router();
const { createTrackingHistory, getLatestTrackingHistory  } = require("./../controllers/trackingHistoryController.js");
const {auth} = require("../middlewares/auth");

router.post("/", auth, createTrackingHistory);
router.get("/latest", auth, getLatestTrackingHistory);

module.exports = router;
