const express = require('express');
const router = express.Router();
const { getPublicVideos } = require('../controllers/videoController.c');

router.get('/public', (req, res) => {
    getPublicVideos(req, res);
});

module.exports = router;