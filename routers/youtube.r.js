const router = require('express').Router();
const youtubeC = require('../controllers/youtube.c');

router.get('/auth', youtubeC.auth);
router.get('/auth/callback', youtubeC.authCallback);
router.post('/upload', youtubeC.uploadVideo);
router.get('/statistics', youtubeC.getViewCount);

module.exports = router;