const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const audioController = require('../controllers/audioController.c');
const proxyController = require('../controllers/proxyController.c');

// POST /routers/audio/generate
router.post('/generate', audioController.generateAudio);

// POST /routers/audio/save
router.post('/save', upload.single('audio'), audioController.uploadAudioToFirebase);

// GET /routers/audio/link
router.get('/link', audioController.getAudioLink);

// GET /routers/audio/proxy
router.get('/proxy', proxyController.proxyAudio); 

module.exports = router;
