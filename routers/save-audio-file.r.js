const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer(); 
const uploadAudioController = require('../controllers/audioController.c');

// POST /routers/save-audio-file
router.post('/', upload.single('audio'), uploadAudioController.uploadAudioToFirebase);

module.exports = router;
