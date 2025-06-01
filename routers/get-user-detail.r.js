const express = require('express');
const router = express.Router();
const { getUserDetail } = require('../controllers/userController.c');

router.get('/', (req, res) => {
    getUserDetail(req, res);
});

module.exports = router;