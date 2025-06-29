const router = require('express').Router();
const { 
    createVideoController,
    insertVideoController
} = require('../controllers/videos.v2');
const {
    createAudiosController
} = require('../controllers/audios.c');


router.post('/', createAudiosController, insertVideoController)

router.post('/generate', createVideoController);

module.exports = router;