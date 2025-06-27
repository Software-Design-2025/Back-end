const router = require('express').Router();
const { 
    getSoundsController, 
    getVoicesController 
} = require('../controllers/assets');

router.get('/sounds', getSoundsController);
router.get('/voices', getVoicesController);

module.exports = router;