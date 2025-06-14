const router = require('express').Router();
const youtubeC = require('../controllers/youtube.c');

router.get('/auth', youtubeC.auth);
router.get('/auth/callback', youtubeC.authCallback);
router.post('/upload', youtubeC.uploadVideo);

module.exports = router;