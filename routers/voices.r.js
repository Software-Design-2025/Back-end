const router = require('express').Router();
const voicesC = require('../controllers/voices.c');

router.post('/', voicesC.createVoice);

module.exports = router;