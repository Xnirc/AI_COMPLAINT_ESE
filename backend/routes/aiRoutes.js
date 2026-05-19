const express = require('express');
const { analyzeComplaint } = require('../controllers/aiController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/analyze', protect, analyzeComplaint);

module.exports = router;
