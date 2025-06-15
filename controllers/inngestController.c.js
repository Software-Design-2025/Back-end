const { inngest } = require('../inngest/client');
const { RenderCloudVideo } = require('../inngest/function');

// POST /api/inngest/render-cloud-video
async function renderCloudVideo(req, res) {
    try {
        const event = req.body || {};
        const result = await RenderCloudVideo(event);
        res.status(200).json({ success: true, result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

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
    renderCloudVideo,
    renderPromoVideo
};
