const router = require('express').Router();
const VideosC = require('../controllers/videos.c');

router.get('/:id', VideosC.getVideoByID);

module.exports = router;