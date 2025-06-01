const express = require('express');
const router = express.Router();
const { removeFavoriteVideo } = require('../controllers/videoController.c');

router.delete('/', (req, res) => {
    removeFavoriteVideo(req, res);
});

module.exports = router;