const express = require('express');
const router = express.Router();
const { proxyAudio } = require('../controllers/proxyController.c');

router.get('/', (req, res) => {
    proxyAudio(req, res);
});

module.exports = router;