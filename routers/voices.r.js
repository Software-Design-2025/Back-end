const router = require('express').Router();
const voicesC = require('../controllers/voices.c');

router.get('/sample', voicesC.getSampleVoices);

module.exports = router;