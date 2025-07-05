const router = require('express').Router();
const {
  registerController,
  localLoginController,
  googleLoginController,
  googleCallbackController,
  facebookLoginController,
  facebookCallbackController,
  logoutController,
  refreshTokenController,
} = require('../controllers/auth.controller');

router.post('/register', registerController);
router.post('/login/local', localLoginController);
router.get('/login/google', googleLoginController);
router.get('/login/google/callback', googleCallbackController);
router.get('/login/facebook', facebookLoginController);
router.get('/login/facebook/callback', facebookCallbackController);
router.get('/logout', logoutController);
router.get('/refresh-token', refreshTokenController);

module.exports = router;
