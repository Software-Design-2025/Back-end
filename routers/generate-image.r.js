const express = require('express');
const router = express.Router();
const { generateImage } = require('../controllers/imageController.c');

router.post('/', (req, res) => {
    generateImage(req, res);
});

module.exports = router;