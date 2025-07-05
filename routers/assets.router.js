const router = require('express').Router();
const {
  getSoundsController,
  getVoicesController,
  getFontsController,
  getStickersController,
} = require('../controllers/assets.controller');

router.get('/sounds', getSoundsController);
router.get('/voices', getVoicesController);
router.get('/fonts', getFontsController);
router.get('/stickers', getStickersController);

module.exports = router;
