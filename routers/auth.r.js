const router = require('express').Router();
const UsersC = require('../controllers/auth.c');

router.post('/register', UsersC.register);
router.post('/login/local', UsersC.localLogin);
router.get('/login/google', UsersC.googleLogin);
router.get('/login/google/callback', UsersC.googleCallback);
router.get('/login/facebook', UsersC.facebookLogin);
router.get('/login/facebook/callback', UsersC.facebookCallback);
router.get('/logout', UsersC.logout);
router.get('/refresh-token', UsersC.refreshToken);

module.exports = router;