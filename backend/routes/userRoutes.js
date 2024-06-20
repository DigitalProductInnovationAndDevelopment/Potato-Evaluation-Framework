const express = require("express");
const router = express.Router();
const { auth } = require('../middlewares/auth');
const { getAllUsers, loginUser } = require("./../controllers/userControllers");

router.get("/", auth, getAllUsers);
router.post("/login", loginUser);

module.exports = router;
