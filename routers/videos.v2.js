const router = require('express').Router();
const { 
    createVideoController,
    insertVideoController,
    getCreatedVideosController,
    getFavoriteVideosController,
    getPublicVideosController,
    setPublicVideoController
} = require('../controllers/videos.v2');
const {
    createAudiosController
} = require('../controllers/audios.c');


router.post('/', createAudiosController, createVideoController, insertVideoController)
router.get('/', getCreatedVideosController);
router.get('/favorites', getFavoriteVideosController);
router.get('/public', getPublicVideosController);
router.patch('/public', setPublicVideoController);

module.exports = router;