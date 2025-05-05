const router = require('express').Router();
const UsersC = require('../controllers/auth.c');

router.post('/register', UsersC.register);

module.exports = router;