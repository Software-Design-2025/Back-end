const express = require('express');
const router = express.Router();
const { generateAudio } = require('../controllers/audioController.c');

router.post('/', (req, res) => {
    generateAudio(req, res);
});

module.exports = router;