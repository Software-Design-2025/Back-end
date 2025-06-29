const router = require('express').Router();
const { 
    createVideoController,
    insertVideoController,
    getCreatedVideosController,
    getFavoriteVideosController
} = require('../controllers/videos.v2');
const {
    createAudiosController
} = require('../controllers/audios.c');


router.post('/', createAudiosController, createVideoController, insertVideoController)
router.get('/', getCreatedVideosController);
router.get('/favorites', getFavoriteVideosController);

module.exports = router;