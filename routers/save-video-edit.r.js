const express = require('express');
const { saveVideoEditConfig } = require('../controllers/videoController.c');

const router = express.Router();

// POST /api/save-video-edit
router.post('/api/save-video-edit', saveVideoEditConfig);

module.exports = router;