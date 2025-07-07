const router = require('express').Router();
const { generateImageController } = require('../controllers/images.controller');

router.post('/', generateImageController);

module.exports = router;
