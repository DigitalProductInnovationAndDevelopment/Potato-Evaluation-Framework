const express = require("express");
const router = express.Router();
const { createUser, getAllUsers, updateUser, deleteUser } = require("../controllers/adminController");
const { auth, adminOnly } = require("../middlewares/auth");

router.post("/users", auth, adminOnly, createUser);
router.get("/users", auth, adminOnly, getAllUsers);
router.put("/users/:id", auth, adminOnly, updateUser);
router.delete("/users/:id", auth, adminOnly, deleteUser);

module.exports = router;
