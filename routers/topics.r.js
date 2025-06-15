const router = require('express').Router();
const TopicsC = require('../controllers/topics.c');

router.get('/ai', TopicsC.getTopicUsingAI);
router.get('/springer-nature', TopicsC.getTopicUsingSpringerNature);

module.exports = router;