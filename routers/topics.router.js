const router = require('express').Router();
const {
  getTopicUsingAIController,
  getTopicUsingSpringerNatureController,
} = require('../controllers/topics.controller');

router.get('/ai', getTopicUsingAIController);
router.get('/springer-nature', getTopicUsingSpringerNatureController);

module.exports = router;
