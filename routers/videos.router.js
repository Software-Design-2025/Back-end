const router = require('express').Router();
const {
  createVideoController,
  insertVideoController,
  getCreatedVideosController,
  getFavoriteVideosController,
  getPublicVideosController,
  setPublicVideoController,
  deleteVideoController,
  editVideoController,
  insertFavoriteVideoController,
  removeFavoriteVideoController,
} = require('../controllers/videos.controller');
const { createAudiosController } = require('../controllers/audios.controller');

router.post(
  '/',
  createAudiosController,
  createVideoController,
  insertVideoController
);
router.get('/', getCreatedVideosController);
router.patch('/edit/:id', editVideoController);
router.get('/favorites', getFavoriteVideosController);
router.patch('/favorites/:id', insertFavoriteVideoController);
router.delete('/favorites/:id', removeFavoriteVideoController);
router.get('/public', getPublicVideosController);
router.patch('/public', setPublicVideoController);
router.delete('/:id', deleteVideoController);

module.exports = router;
