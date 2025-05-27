const VideosM = require('../models/videos.m');

module.exports = {
    getVideoByID: async (req, res) => {
        try {
            const video = await VideosM.findOne(req.params.id);
            if (!video) {
                return res.status(404).json({ message: 'Video not found' });
            }
            return res.status(200).json(video);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}