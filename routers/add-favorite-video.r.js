const express = require('express');
const router = express.Router();
const { addFavoriteVideo } = require('../controllers/videoController.c');

router.post('/', (req, res) => {
    addFavoriteVideo(req, res);
});

module.exports = router;
