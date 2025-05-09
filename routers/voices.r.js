const router = require('express').Router();
const voicesC = require('../controllers/voices.c');

router.get('/sample', voicesC.getSampleVoices);
router.post('/', voicesC.createSpeech);

module.exports = router;