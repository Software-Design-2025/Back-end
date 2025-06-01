const express = require('express');
const router = express.Router();
const { updateUserCredits } = require('../controllers/userController.c');

router.post('/', (req, res) => {
    updateUserCredits(req, res);
});

module.exports = router;