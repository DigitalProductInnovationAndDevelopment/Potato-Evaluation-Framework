const express = require("express");
const router = express.Router();
const { createTrackingHistory, getLatestTrackingHistory  } = require("./../controllers/trackingHistoryController.js");
const {auth} = require("../middlewares/auth");

router.post("/", auth, createTrackingHistory);
router.get("/get-latest-tracking-history", auth, getLatestTrackingHistory);

module.exports = router;
