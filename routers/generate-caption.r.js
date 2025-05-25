const express = require('express');
const router = express.Router();
const { generateCaption } = require('../controllers/captionController.c');

router.post('/', (req, res) => {
    generateCaption(req, res);
});

module.exports = router;