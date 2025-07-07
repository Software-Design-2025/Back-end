const router = require('express').Router();
const {
  generateVideoScriptController,
} = require('../controllers/script.controller');

router.post('/', generateVideoScriptController);

module.exports = router;
