const express = require("express");
const router = express.Router();

const { getAllUsers, loginUser } = require("./../controllers/userControllers");

router.get("/", getAllUsers);
router.post("/login", loginUser);

module.exports = router;
