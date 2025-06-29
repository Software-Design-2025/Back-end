const router = require('express').Router();
const { 
    createVideoController 
} = require('../controllers/videos.v2');

router.post('/generate', createVideoController);

module.exports = router;