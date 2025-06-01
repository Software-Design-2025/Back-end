const express = require('express');
const router = express.Router();
const { getFavoriteVideos } = require('../controllers/videoController.c');

router.get('/', (req, res) => {
    getFavoriteVideos(req, res);
});

module.exports = router;