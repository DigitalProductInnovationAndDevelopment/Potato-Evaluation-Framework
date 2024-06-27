const express = require("express");
const router = express.Router();
const { auth } = require('../middlewares/auth');
const { getAllModels, addModel, deleteModel, setCurrentModel  } = require("./../controllers/modelController.js");

router.get("/", auth, getAllModels);
router.delete("/:id",auth, deleteModel);
router.post("/addModel", auth, addModel);
router.post("/setCurrentModel/:id", auth, setCurrentModel);

module.exports = router;
