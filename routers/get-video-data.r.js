const express = require('express');
const router = express.Router();
const { getVideoData } = require('../controllers/videoController.c');

router.get('/', (req, res) => {
    getVideoData(req, res);
});

module.exports = router;