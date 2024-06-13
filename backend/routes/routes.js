const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes.js');
const parametersRoutes = require('./parametersRoutes.js');

router.use('/users', userRoutes);
router.use('/parameters', parametersRoutes);



module.exports = router;