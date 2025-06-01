const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController.c');

router.patch('/', videoController.updateVideoPublicStatus);

module.exports = router;
