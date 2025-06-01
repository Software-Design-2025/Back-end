const express = require('express');
const router = express.Router();
const { generateVideoScript } = require('../controllers/scriptController.c');

router.post('/', (req, res) => {
    generateVideoScript(req, res);
});

module.exports = router;