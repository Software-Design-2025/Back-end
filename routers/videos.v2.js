const router = require('express').Router();
const { 
    createVideoController,
    insertVideoController,
    getCreatedVideosController,
    getFavoriteVideosController,
    getPublicVideosController,
    setPublicVideoController,
    deleteVideoController,
    editVideoController
} = require('../controllers/videos.v2');
const {
    createAudiosController
} = require('../controllers/audios.c');


router.post('/', createAudiosController, createVideoController, insertVideoController)
router.get('/', getCreatedVideosController);
router.patch('/edit/:id', editVideoController);
router.get('/favorites', getFavoriteVideosController);
router.get('/public', getPublicVideosController);
router.patch('/public', setPublicVideoController);
router.delete('/:id', deleteVideoController);

module.exports = router;