const router = require('express').Router();
const { createVoiceController } = require('../controllers/voices.controller');

router.post('/', createVoiceController);

module.exports = router;
