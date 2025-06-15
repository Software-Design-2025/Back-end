const express = require('express');
const router = express.Router();
const { renderCloudVideo, renderPromoVideo } = require('../controllers/inngestController.c');

// POST /api/inngest/render-cloud-video
router.post('/render-cloud-video', renderCloudVideo);

// POST /api/inngest/render-promo-video
router.post('/render-promo-video', renderPromoVideo);

module.exports = router;
