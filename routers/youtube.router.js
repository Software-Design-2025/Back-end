const router = require('express').Router();
const {
  authController,
  authCallbackController,
  uploadVideoController,
  getStatisticsController,
  getAccountsController,
  getUploadedVideosController,
  getTopViewVideosController,
} = require('../controllers/youtube.controller');

router.get('/auth', authController);
router.get('/auth/callback', authCallbackController);
router.post('/upload', uploadVideoController);
router.get('/statistics', getStatisticsController);
router.get('/accounts', getAccountsController);
router.get('/videos', getUploadedVideosController);
router.get('/top-views', getTopViewVideosController);

module.exports = router;
