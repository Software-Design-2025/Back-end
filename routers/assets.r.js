const router = require('express').Router();
const { 
    getSoundsController, 
    getVoicesController,
    getFontsController 
} = require('../controllers/assets');

router.get('/sounds', getSoundsController);
router.get('/voices', getVoicesController);
router.get('/fonts', getFontsController);

module.exports = router;