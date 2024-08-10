const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes.js');
const parametersRoutes = require('./parametersRoutes.js');
const modelsRoutes = require('./modelsRoutes.js');
const trackingHistoryRoutes = require('./trackingHistoryRoutes.js');

router.use('/users', userRoutes);
router.use('/parameters', parametersRoutes);
router.use('/models', modelsRoutes);
router.use('/tracking-history', trackingHistoryRoutes);
router.use('/defect-config', trackingHistoryRoutes);


module.exports = router;