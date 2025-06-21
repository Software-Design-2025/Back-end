const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videos.c');
const scriptController = require('../controllers/scriptController.c');

// Video data
router.post('/save-data', videoController.saveVideoData);
router.get('/get-data', videoController.getVideoData);
router.post('/generate-script', scriptController.generateVideoScript); 
router.get('/by-creator', videoController.getVideosByCreatedBy);
router.get('/public', videoController.getPublicVideos);
router.patch('/public-status', videoController.updateVideoPublicStatus);
router.post('/save-edit', videoController.saveVideoEditConfig);
router.post('/save-link-video', videoController.saveLinkVideo);

// Caption & Image
router.post('/generate-caption', require('../controllers/captionController.c').generateCaption);
router.post('/generate-image', require('../controllers/imageController.c').generateImage);

// Favorite video
router.post('/add-favorite', videoController.addFavoriteVideo);
router.get('/favorites', videoController.getFavoriteVideos);
router.post('/remove-favorite', videoController.removeFavoriteVideo);

// POST /routers/video/generate-caption
router.post('/generate-caption', require('../controllers/captionController.c').generateCaption);

// POST /routers/video/generate-image
router.post('/generate-image', require('../controllers/imageController.c').generateImage);

// GET /routers/video/favorites
router.get('/favorites', videoController.getFavoriteVideos);

// POST /routers/video/remove-favorite
router.post('/remove-favorite', videoController.removeFavoriteVideo);

// POST /routers/video/add-favorite
router.post('/add-favorite', videoController.addFavoriteVideo);

module.exports = router;
