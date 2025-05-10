const router = require('express').Router();
const TopicsC = require('../controllers/topics.c');

router.post('/trending', TopicsC.getTrendingTopics);

module.exports = router;