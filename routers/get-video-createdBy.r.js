const express = require('express');
const router = express.Router();
const { getVideosByCreatedBy } = require('../controllers/videoController.c');

router.get('/', (req, res) => {
    getVideosByCreatedBy(req, res);
});

module.exports = router;