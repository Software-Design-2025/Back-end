const { inngest } = require('../inngest/client');

// POST /api/inngest/render-promo-video
async function renderPromoVideo(req, res) {
    try {
        const { videoId, videoData } = req.body;
        await inngest.send({
            name: 'render/promo-video',
            data: {
                videoId,
                videoData
            }
        });
        res.json({ result: 'Inngest Function Triggered' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    renderPromoVideo
};
