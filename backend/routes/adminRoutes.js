const express = require("express");
const { createUser, getAllUsers, updateUser, deleteUser } = require("../controllers/adminController");
const { auth, adminOnly } = require("../middlewares/auth");

const router = express.Router();

router.post("/admin/users", auth, adminOnly, createUser);
router.get("/admin/users", auth, adminOnly, getAllUsers);
router.put("/admin/users/:id", auth, adminOnly, updateUser);
router.delete("/admin/users/:id", auth, adminOnly, deleteUser);

module.exports = router;
