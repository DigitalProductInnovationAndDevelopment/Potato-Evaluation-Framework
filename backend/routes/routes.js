const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes.js');
const parametersRoutes = require('./parametersRoutes.js');
const modelsRoutes = require('./modelsRoutes.js');

router.use('/users', userRoutes);
router.use('/parameters', parametersRoutes);
router.use('/models', modelsRoutes);



module.exports = router;