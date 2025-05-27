const router = require('express').Router();
const VideosC = require('../controllers/videos.c');

router.get('/public', VideosC.getPublicVideos);
router.get('/:id', VideosC.getVideoByID);

module.exports = router;