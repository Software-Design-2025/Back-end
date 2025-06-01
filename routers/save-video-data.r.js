const express = require('express');
const router = express.Router();
const { saveVideoData } = require('../controllers/videoController.c');

router.post('/', (req, res) => {
    saveVideoData(req, res);
});

module.exports = router;
